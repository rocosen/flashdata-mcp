import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash,createHmac } from 'node:crypto';
import { runDownload,createBackendClient,validateInput,EVENT,RunError } from '../src/run.js';
const input={url:'https://www.youtube.com/watch?v=jNQXAC9IVRw'};
const runId='0123456789abcdefg';
function fixture() {
  let now=1794268800000,charged=false,failed=false,count=0,attempts=0;const values=new Map(),calls=[];
  const intent={charged:false,event_name:EVENT,count:3,idempotency_key:'stable-key',charge_before:new Date(now+90000).toISOString(),price_usd:0.01,max_total_charge_usd:1};
  const output={run_id:runId,download_url:'https://storage.example/file',size_bytes:2100000,charged_mb:3};
  const backend=async(method,path)=>{
    calls.push([method,path]);
    if(path==='job')return {status:failed?'failed':'completed',size_bytes:2100000};
    if(path==='charge')return {...intent,charged};
    if(path==='file'&&charged)return output;
    const error=new RunError('pending');error.code='charge_unconfirmed';throw error;
  };
  const options={input,runId,backend,now:()=>now,sleep:async ms=>{now+=ms;},
    charge:async()=>{attempts++;charged=true;},store:{setValue:async(k,v)=>values.set(k,v)},
    dataset:{getInfo:async()=>({itemCount:count}),pushData:async()=>{count++;}}};
  return {options,intent,values,calls,setFailed:()=>{failed=true;},setCharged:()=>{charged=true;},attempts:()=>attempts,rows:()=>count};
}
test('one file, one charge; resumed run refreshes OUTPUT without another charge or row',async()=>{
  const f=fixture();await runDownload(f.options);await runDownload(f.options);
  assert.equal(f.attempts(),1);assert.equal(f.rows(),1);assert.equal(f.values.get('OUTPUT').status,'completed');
  assert.deepEqual(f.values.get('BILLING'),{status:'confirmed',charged_mb:3});
});
test('failed downloads do not request billing or output files',async()=>{
  const f=fixture();f.setFailed();await assert.rejects(runDownload(f.options),/No download event/);
  assert.equal(f.attempts(),0);assert.equal(f.calls.some(([,p])=>p==='charge'),false);
});
test('lost charge response reconciles instead of sending another charge',async()=>{
  const f=fixture();let sent=0;f.options.charge=async()=>{sent++;f.setCharged();throw Error('lost');};
  await runDownload(f.options);assert.equal(sent,1);assert.equal(f.rows(),1);
});
test('unconfirmed charge withholds file and never loops charge requests',async()=>{
  const f=fixture();let sent=0;f.options.charge=async()=>{sent++;throw Error('network');};
  await assert.rejects(runDownload(f.options),/not confirmed/);assert.equal(sent,1);assert.equal(f.rows(),0);
  assert.equal(f.values.get('OUTPUT').download_url,undefined);
});
for(const [label,change] of [
  ['expired',i=>{i.charge_before='2020-01-01T00:00:00Z';}],
  ['over budget',i=>{i.max_total_charge_usd=0.02;}],
  ['wrong event',i=>{i.event_name='another-fee';}],
  ['fractional count',i=>{i.count=2.5;}],
  ['invalid expiry',i=>{i.charge_before='invalid';}],
])test(`${label} cannot charge`,async()=>{
  const f=fixture();change(f.intent);await assert.rejects(runDownload(f.options),/authorization/);assert.equal(f.attempts(),0);
});
test('polls a pending acceptance and does not resubmit within the run',async()=>{
  const f=fixture(),original=f.options.backend;let polls=0;
  f.options.backend=async(m,p,b)=>{if(m==='GET'&&p==='job'&&polls++<2){const e=new RunError('pending');e.code='submission_pending';throw e;}return original(m,p,b);};
  await runDownload(f.options);assert.equal(f.calls.filter(([m,p])=>m==='POST'&&p==='job').length,1);
});
test('BYOK and advanced legacy fields are rejected before backend',()=>{
  for(const extra of [{flashdataApiKey:'secret'},{storageJson:'secret'},{jobId:'job_123'},{start_at:'00:01:00'}])assert.throws(()=>validateInput({...input,...extra}),/no longer required/);
});
test('backend request signs exact bytes and does not leak shared secret',async()=>{
  const secret='s'.repeat(32),now=1794268800000;let captured;
  const backend=createBackendClient({runId,secret,now:()=>now,request:async(url,opts)=>{captured={url,...opts};return {ok:true,json:async()=>({status:'pending'})};}});
  await backend('POST','job',input);
  const body=JSON.stringify(input),digest=createHash('sha256').update(body).digest('hex');
  const expected=createHmac('sha256',secret).update(['POST','/apify/youtube-download/job',runId,String(now),digest].join('\n')).digest('hex');
  assert.equal(captured.headers['X-Apify-Signature'],expected);assert.equal(captured.redirect,'error');
  assert.equal(JSON.stringify(captured).includes(secret),false);
  await backend('GET','job');assert.equal(captured.body,undefined);
});
test('untrusted origins and missing provider config cannot receive secrets',()=>{
  for(const baseUrl of ['http://example.com','https://user@example.com','https://example.com/path','https://example.com/?token=1'])
    assert.throws(()=>createBackendClient({runId,secret:'s'.repeat(32),baseUrl}),/not configured/);
});
