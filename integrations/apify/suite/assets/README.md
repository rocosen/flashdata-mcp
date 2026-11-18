# Apify Actor icons

Google Actors use the Google G icon; YouTube Actors use the YouTube play icon.
The suite generator copies the matching PNG into each generated Actor. YouTube Download is maintained independently and uses the same YouTube asset.
Upload `assets/logo.png` in each Actor’s Publishing → Display information → Icon settings. An Actor build does not update its Store icon.

Source SVGs (retrieved 2026-11-17):
- Google: https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg
- YouTube: https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg

PNG treatment: 1024 × 1024 white canvas; centered, original aspect ratio; Google rendered within 768 × 768, YouTube within 820 × 820. No FlashData logo or extra text. These are third-party service marks used to identify the source platform; the Actors remain independently published by FlashData.
