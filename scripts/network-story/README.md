# Network comedy story

The current cut is `comedy.json`: Ayan and Sara meet two new characters, gateway inspector Port Petrovich and ARP herald Arpi. It explains MTU, packet size versus speed, IPv4/IPv6 fragmentation differences, and why an IPv6 neighbor uses ND rather than ARP. Arpi's wrong-department arrival is intentional and corrected in his dialogue.

The live episode is `public/events/computer-networks-endterm/stories/packet-too-big-v3.mp4`, with a poster and Russian VTT. It is a focused MTU story, not the entire module or nine-part course. It appears as a separate collapsible story in module 8. The user rejected the original narrated slide course; that course is not deployed.

Assets in `assets/`:
- `port-petrovich.png` and `arpi.png`: new transparent character sprites made with built-in image_gen.
- `checkpoint.png`: image_gen network-city background.
- `chuckle.mp3` and `laugh.mp3`: original ElevenLabs sound effects, 2.5 seconds each; reuse them rather than spending again.
- Existing Ayan/Sara rigs remain in `public/stories/pm-finale-ayan-returns/rig/`.

This is deterministic 2D character animation using 3D-styled images. Characters move, change shots/poses, blink and react; existing human mouths follow speech envelopes. The robot's indicators and the pigeon's megaphone animate with speech. There is no fully rigged 3D model.

Reproduce (repository root, ffmpeg/ffprobe, Playwright Chromium, Python + numpy):

```sh
mkdir -p output/network-story-v3
node scripts/network-story/voice.mjs scripts/network-story/comedy.json output/network-story-v3
node scripts/network-story/laughs.mjs
python3 scripts/network-story/sound.py output/network-story-v3
node scripts/network-story/render.mjs --comedy --out=output/network-story-v3
node scripts/network-story/mix.mjs output/network-story-v3
```

Speech uses the existing ElevenLabs key file outside the repository and caches takes by voice/text/model under `~/.cache/yg-video/network-story`. Keep this cache: unchanged dialogue does not need new requests. The two laugh effects cost 25 provider-reported credits each. Six cues play in deliberately extended dialogue pauses; mix.mjs asserts they end before the next line. The final mix is normalized to -16 LUFS with a -1.5 dB true-peak target. Runtime viewers make no ElevenLabs requests.

`pilot.json` and `stage.js` preserve the earlier style pilot. `season-outline.json` holds the planned nine-episode progression; it is not evidence that those episodes have been rendered. `e2e/specs/41-network-story.mjs` checks playback, mobile fit and stopping playback when the card closes.

## Полный сезон

Девять полных серий для модулей 8–16: [course/README.md](course/README.md). Короткий MTU-пилот выше сохранён как отдельная ранняя история; основной плеер курса теперь использует полный сезон с главами.
