# Computer Vision — Final preparation

## Final format
The syllabus lists a final project and allows the instructor to specify the format. The published final sample describes a 120-minute team project for three students, followed by a short oral defence. Treat this as the published practice format, not a guarantee of the actual dataset or task. The original sample questions are not reproduced here.

## Prepare a reproducible workflow
- Load and inspect data; separate training, validation and test data without leakage.
- Justify preprocessing and label-preserving augmentation.
- Build a baseline, train a model and interpret loss curves.
- Select metrics that fit classification, detection or segmentation; analyse errors and robustness.
- Save code, configuration and evidence so another teammate can reproduce the result.
- Ensure every member can explain the complete pipeline and its limitations.

## Study order
Use lectures 1–5 for representations, classifiers, gradients and CNNs. Then revise training and transfer learning, sequence models and attention, detection and segmentation, reinforcement learning, and generative models.

## LMS instructions
The final sample permits lecture materials, earlier personal code and official library documentation, and excludes AI assistants during the assessment. The final submission box asks for reports and, where applicable, articles or certificates. The research-paper exemption is conditional on prior instructor approval and submission deadlines; do not assume it applies to you.

## A 120-minute rehearsal plan
This is a suggested study route based on the published practice format, not a new instructor requirement. Minutes 0–10: read and assign roles; 10–35: data and visualization; 35–70: baseline and training; 70–95: metrics, comparison and robustness; 95–110: short report; 110–120: file checks and defence rehearsal. Practise the individual units below beforehand.

## Deliverable checks
The sample requests a notebook that runs top to bottom with visible outputs, a 1–2 page PDF report and a short oral defence. Explain the goal, method, measured results, limitations and contributions. On 16 November the LMS Final Exam Submission Box displayed a deadline of 21 November, 00:00. This is the submission-box deadline, not a confirmed exam timetable; check current instructor instructions.

## Use the CV tutor
Choose a practice unit and open a question draft. Send it to start explanation, original practice, feedback on your attempt or an oral rehearsal. Notes work without AI. Lecture content comes from the saved archive; the course listing and final sample were rechecked on 16 November.

# 1. A leak-free data pipeline

## What to practise
Image → label and shape checks → split → transforms → batch → model. Inspect examples and class counts. Check corrupt files, duplicates and related frames from the same scene.
## Train / validation / test
Training updates weights. Validation selects settings and checkpoints. Test evaluates the selected model. Keep related frames or subjects in the same split. Augment after splitting and only in training; estimate data-dependent normalization statistics from training data.
## Augmentation is a hypothesis
A transform must preserve the label. Flipping a directional symbol can change its meaning; aggressive cropping can remove the object. Validation and test normally use deterministic preprocessing. Corruption testing is a separate labelled experiment.
## Independent practice · 20 minutes
Use a small labelled dataset. Show 8 examples, class counts, split sizes and one safe and unsafe transform. Deliver a one-page data audit and explain why the split avoids leakage.
## Defence sentence
“We split the data before augmentation. Validation guides model selection, while the test set is reserved for final evaluation. Related images stay in the same split to prevent leakage.”

# 2. CNN and training

## Explain one batch
CNN input is commonly N×C×H×W. Convolutions extract local features; activations add nonlinearity; pooling reduces spatial size; the classifier emits class logits.
## Two calculations
For a standard convolution without dilation: out = floor((in + 2p − k)/s) + 1. Input 32, kernel 3, padding 1 and stride 2 give 16.
Parameters with bias: (k×k×C_in + 1)×C_out. A 3×3 layer from 3 to 16 channels has 448 parameters. Image size does not change this layer's weight count.
## Training loop
Zero gradients → forward → loss → backward → optimizer step. Standard multiclass cross-entropy consumes logits, not precomputed softmax. Evaluation mode changes dropout and batch normalization; disabling gradients alone does not switch evaluation mode.
## Transfer learning
Replace the classifier, train its new head, then optionally unfreeze part of the backbone at a smaller learning rate. Justify time, parameters and measured quality. Parameter count alone does not prove device latency.
## Practice · 25 minutes
Draw tensor shapes through three CNN blocks, calculate the first layer's parameters and explain the training loop. Compare training from scratch and transfer learning as experimental plans.

# 3. Metrics and imbalance

## Why accuracy is not enough
Predicting A for every example gives 90% accuracy if A represents 90 of 100 examples, while missing all B examples. Inspect class support, confusion matrices and per-class metrics.
## Worked formulas
Precision = TP/(TP+FP), recall = TP/(TP+FN), F1 = 2TP/(2TP+FP+FN). With TP=12, FP=3, FN=5: precision=0.80, recall≈0.706 and F1=0.75. Macro-F1 averages class F1 values; it is not F1 computed from averaged precision and recall. Weighted-F1 weights by class support.
## Confusion matrix
Label true and predicted axes. Row normalization shows where each true class goes. Small class support increases uncertainty. A subset of frequent classes does not replace all-class metrics.
## A fair experiment
Compare baseline against weighted loss OR oversampling with the same split, training budget and evaluation. Do not change architecture, augmentation and balancing together. Record seeds and versions; multiple seeds better show variability. Balancing is not guaranteed to improve results.
## Practice · 20 minutes
For [[45,5],[15,5]] with true labels in rows, calculate accuracy and class F1 values. Check: accuracy=0.7143, F1_A=0.8182, F1_B=0.3333 and macro-F1≈0.5758. Explain the gap.

# 4. Debugging and robustness

## Read both curves
Falling train loss with rising validation loss suggests overfitting. Both high: inspect labels, preprocessing, capacity and learning rate. NaN: inspect input values, learning rate and numerical stability. These are diagnostic hypotheses, not proven causes.
## Start small
Inspect batch shapes, dtypes, ranges and labels. Try overfitting a tiny training subset before adding complexity. Select checkpoints on validation, not test.
## Stress test
Evaluate the same checkpoint on clean, darkened, blurred and noisy images separately. Keep labels and record corruption settings. Compute in floating point and clip before converting to uint8. Apply corruptions before normalization and handle RGB/BGR consistently.
## Interpret the result
Accuracy dropping from 0.80 to 0.68 is a 12 percentage-point drop, or 15% relative decrease. Propose a fix as a hypothesis until tested. A stress-test set used to tune the model is no longer an independent final test.
## Practice · 20 minutes
Create an empty clean/dark/blur/noise results table for your measurements. For each failure, propose a cause, a check and a possible fix. Never invent measurements.

# 5. Defence in simple English

## A 30–45 second answer
State what you did, why, how you checked it and one limitation. Use your own measured results. Never invent a missing number.
## Five original practice questions
1. Why did you choose this architecture?
2. How did you prevent data leakage?
3. Why report macro-F1 as well as accuracy?
4. What changed in your controlled experiment?
5. What fails under poor lighting, and how would you investigate it?
## Complete these sentence frames
“We chose this model because … We compared it with … under the same training budget.”
“Macro-F1 gives each class equal weight, so weak minority-class performance is easier to notice.”
“Our result applies to this dataset and split. We have not measured performance on a real device.”
“The model struggled with … Our next experiment would test … while keeping … fixed.”
## Self-check
Explain data loading, loss, optimizer, checkpoint choice, metrics and limitations without prompts. Every teammate should understand the full pipeline. Run the notebook from a clean runtime and match reported numbers to outputs.
## Rehearsal
Explain the team solution in three minutes, then answer one unexpected question per member. These are practice prompts, not predicted instructor questions.

# What computer vision is: AI, ML, DL and applications

## What computer vision is
**Computer vision (CV)** is about **building artificial systems that process, perceive and reason about visual data** — photos, video frames, medical scans, satellite images.
One useful way to read the three verbs of the definition:
| Verb | What the system does | Example |
|---|---|---|
| Process | turns pixels into other pixels or numbers | resize, remove noise, find edges |
| Perceive | recognizes what is in the picture | ‘this is a cat’, ‘a car on the left’ |
| Reason | draws conclusions about the scene | ‘the car is turning, so slow down’ |
The lecture opens with a collage titled **‘Computer vision is everywhere!’** — think of face unlock on phones, self-driving cars, medical scans, factory robots, space and satellite images.
## Deep learning for computer vision
The course is called ‘Deep Learning for Computer Vision’, and the lecture defines the two extra words:
- **Learning** — building artificial systems that **learn from data and experience** instead of following rules written by hand;
- **Deep** — **hierarchical learning algorithms with many ‘layers’**, **(very) loosely inspired by the brain**.
| Approach | Who decides how it works | Example |
|---|---|---|
| Hand-designed | the programmer writes the rule | Canny: an edge is where brightness changes sharply |
| Learned | the model fits its weights to labelled examples | a network trained on 10 000 photos of cats and dogs |
A hand-designed method can be very useful (edge detectors are used every day), but it **learns nothing** from data. A learned method gets better when you give it more well-labelled data.
## Where computer vision sits among AI fields
The lecture draws a Venn diagram step by step:
- **Artificial Intelligence (AI)** is the large outer circle;
- **Machine Learning (ML)** lies inside AI, and **Deep Learning (DL)** lies inside ML;
- **Computer Vision** lies inside AI and **overlaps** ML and DL but is **not contained** in them — classical CV methods such as edge detection or keypoint matching do not learn;
- **Natural Language Processing**, **Speech Recognition** and **Robotics** are other AI fields that also overlap deep learning;
- **this course** is the red region: the **intersection of computer vision and deep learning**.
= DL ⊂ ML ⊂ AI
= CV ⊂ AI, CV ∩ ML ≠ ∅, CV ⊄ ML
= this course = CV ∩ DL
## What the computer actually receives
To a program a photo is not ‘a cat’ but a **grid of numbers**. In OpenCV:
@diagram cv-image-array
= img = cv2.imread('cat.jpg')
= print(img.shape)  # (480, 640, 3)
= print(img.dtype)  # uint8
- **img.shape** is **(height, width, channels)**: rows first, then columns, then the 3 colour channels — a photo 640 wide and 480 tall gives (480, 640, 3);
- OpenCV stores the channels in **BGR** order (blue, green, red), not RGB;
- every value is an 8-bit integer (**uint8**) from **0 (dark)** to **255 (bright)**;
- a **grayscale** image has a single channel and shape **(height, width)** — there is no third number;
- if the path is wrong, **cv2.imread returns None** without an error, and the program crashes only on the next line that uses img.
= 480 × 640 × 3 = 921 600 numbers
Turning those 921 600 numbers into ‘a cat sitting on a sofa’ is the whole job of computer vision — and the reason it is hard.
## ConvNets are everywhere (2012 to present)
Since 2012 **convolutional networks (ConvNets, CNNs)** solve most vision tasks. The tasks differ in **what the output looks like**:
| Task | Output | Example from the slides |
|---|---|---|
| Image classification | one label for the whole image | ‘leopard’, ‘container ship’, with the top-5 guesses |
| Image retrieval | the images most similar to a query | rows of similar flowers, elephants, pumpkins |
| Object detection | a box, a label and a score for each object | ‘dog 0.99’, ‘person 0.99’ (Ren et al., 2015) |
| Image segmentation | a label for every pixel | road, sky, tree, building, person (Farabet et al., 2012) |
| Video classification | one label for a whole clip | two-stream ConvNet (Simonyan et al., 2014) |
| Activity recognition | what the person is doing | video frames → conv layers → softmax |
| Pose recognition | the positions of body joints | a coloured stick figure over a person (Toshev and Szegedy, 2014) |
| Image captioning | a sentence | ‘A cat sitting on a suitcase on the floor’ |
- **Two-stream video network**: a **spatial stream** ConvNet looks at a **single frame** (what is in the scene), a **temporal stream** ConvNet looks at **multi-frame optical flow** (how things move); their class scores are **fused** at the end.
- **Playing Atari games** (Guo et al., 2014): a ConvNet looks at the game screen and chooses the next move.
- **Image captioning** (Vinyals et al., 2015; Karpathy and Fei-Fei, 2015) joins vision and language: ‘A man riding a wave on top of a surfboard’.
- **DeepDream** (Mordvintsev et al., 2015) makes a network exaggerate the patterns it ‘sees’ in an image.
- **Neural style transfer** (Gatys et al., 2016) redraws a photo in the style of a painting such as Van Gogh's ‘The Starry Night’.
![Four copies of the same sunny street photo in a 2×2 grid: top left the plain photo with a car, a cyclist seen from behind and a dog; top right thin coloured rectangles around the car, the cyclist and the dog; bottom left every pixel tinted by class — road grey, car blue, cyclist red, dog orange, sky light blue, trees green; bottom right a stick figure of coloured lines over the cyclist's joints](/events/cv/l1-vision-tasks.webp)
## Still a long way to go
After all these successes the lecture warns: **despite our success, computer vision still has a long way to go**.
The example (credit: Andrej Karpathy) is a photo of a corridor: a man weighs himself on a scale, another man secretly presses the scale with his foot, and the people around laugh.
To understand the photo, a system has to:
- recognize people, a scale and **mirrors** (some people appear twice);
- know the **physics**: a foot on the platform makes the scale show more weight;
- understand **intentions**: the man on the scale cannot see the foot, and the others are in on the joke.
A classifier can output ‘people, corridor, scale’, but **reasoning about the scene** is still hard — the last verb of the definition is the hardest one.
> Computer vision is the AI field about visual data; deep learning is a part of machine learning that now powers most of it, and this course studies their intersection.
## Check yourself
?? A student says: ‘Computer vision is just a part of deep learning.’ Do you agree? Explain with the AI / ML / DL diagram.
?= No. DL ⊂ ML ⊂ AI, while computer vision is a separate AI field that only overlaps ML and DL: classical methods such as Canny edge detection or SIFT matching solve vision problems without learning. The course studies the intersection CV ∩ DL.
?? A hospital wants every pixel of a CT slice marked as ‘tumour’ or ‘healthy tissue’. Which CV task is this, and why is image classification not enough?
?= Image segmentation — the output is a label for every pixel. Classification gives one label for the whole image, so it could say ‘tumour present’ but not where the tumour is or how big it is.

# A short history: from Hubel & Wiesel to deep learning

## Two stories that meet in 2012
The lecture's history has two threads: **computer vision** (how to make machines see) and **neural networks** (how to make machines learn). They merge in **2012 with AlexNet**.
## Hubel and Wiesel, 1959: how the brain sees
Hubel and Wiesel **measured the brain activity** of single neurons in a cat's visual cortex while showing it bars of light. A neuron responded to a bar at one angle and gave **no response** at another.
| Cell type | Responds to |
|---|---|
| Simple cells | light **orientation** — an edge at a certain angle |
| Complex cells | light orientation **and movement** |
| Hypercomplex cells | **movement with an end point** |
The lesson: vision is **hierarchical** — simple local features such as oriented edges come first, then more and more complex combinations of them. Convolutional networks are built the same way.
## Larry Roberts, 1963: edges of a block
Roberts (often called the author of the first PhD thesis in computer vision) recognized simple 3-D blocks in three steps:
- **(a) original picture** of a block;
- **(b) differentiated picture** — the brightness is differentiated, so only the **edges** (sharp changes of brightness) remain;
- **(c) feature points selected** — corners and points on the edges, used to recover the 3-D shape.
## The Summer Vision Project, 1966
An MIT memo by **Seymour Papert** (Vision Memo No. 100, July 1966) planned to use **summer workers** to build **a significant part of a visual system** in one summer, split into sub-problems. Vision turned out to be far harder: the field is still working on it more than 50 years later.
## David Marr, 1970s: stages of visual representation
| Stage | What it contains |
|---|---|
| Input image | perceived intensities (pixel brightness) |
| Primal sketch | zero crossings, blobs, edges, bars, ends, virtual lines, groups, curves, boundaries |
| 2½-D sketch | local surface orientation, discontinuities in depth and in surface orientation |
| 3-D model | 3-D models organized hierarchically from surface and volumetric primitives |
## Recognition via parts, 1970s
- **Pictorial structures** (Fischler and Elschlager, 1973): an object is a set of **parts** (head, torso, limbs) joined by flexible connections, like a stick figure.
- **Generalized cylinders** (Brooks and Binford, 1979): an object is assembled from **cylinder-like volumes** — a person made of tubes.
## Recognition via edge detection, 1980s
**John Canny (1986)** gave the classic edge detector, and **David Lowe (1987)** recognized objects by their edges. The slide shows colourful razors next to their edge map: thin white lines on black, **all colour gone**.
The same detector is one line in OpenCV today:
@diagram cv-pipeline
= gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
= blur = cv2.GaussianBlur(gray, (5, 5), 0)
= edges = cv2.Canny(blur, 100, 200)
- **Hysteresis**: a gradient above the high threshold (200) is a **strong edge**; below the low threshold (100) it is **discarded**; in between it is kept **only if it is connected to a strong edge**.
- **Blur first**: derivatives amplify noise, so without smoothing noisy pixels turn into **false edges**.
- The output is a **single-channel 0/255 edge map**: if the task depends on colour (ripe vs unripe fruit), edges alone throw the key information away.
![Left half: several colourful plastic razors (pink, blue, green and black) lying on a light-blue table; right half: the same scene as a black image in which only thin white lines trace the edges of the razors, with no colour at all](/events/cv/l1-edges-vs-colour.webp)
## Grouping, matching and the first ML successes
- **Normalized Cuts** (Shi and Malik, 1997) — **recognition via grouping**: split the image into coherent regions (a monk, umbrellas, a tower) before recognizing them.
- **SIFT** (David Lowe, 1999) — **recognition via matching**: find distinctive keypoints and match them between two photos of the same stop sign taken from different angles and distances.
- **Viola and Jones (2001)** — fast **face detection**, **one of the first successful applications of machine learning to vision**.
- The timeline marks an **AI Winter** over the late 1980s and the 1990s — years of low interest and funding for AI.
## Benchmarks: PASCAL and ImageNet
- **PASCAL Visual Object Challenge**: find objects such as a train, a person or an airplane; on PASCAL VOC 2007 the mean Average Precision (mAP) grew from about 17% (2007) to about 41% (2011).
- **ImageNet** (Deng et al., 2009): the classification challenge has **1,000 object classes** and **1,431,167 images**. In the **top-5** metric an answer is correct if the true class is among the model's 5 best guesses (for example scale, T-shirt, steel drum, drumstick, mud turtle).
| Year | Model | Top-5 error, % |
|---|---|---|
| 2010 | Lin et al. | 28.2 |
| 2011 | Sanchez and Perronnin | 25.8 |
| 2012 | AlexNet (Krizhevsky et al.) | 16.4 |
| 2013 | Zeiler and Fergus | 11.7 |
| 2014 | VGG (Simonyan and Zisserman) | 7.3 |
| 2014 | GoogLeNet (Szegedy et al.) | 6.7 |
| 2015 | ResNet (He et al.) | 3.6 |
| 2016 | Shao et al. | 3.0 |
| 2017 | SENet (Hu et al.) | 2.3 |
| — | Human (Russakovsky et al.) | 5.1 |
= 2011 → 2012: 25.8 − 16.4 = 9.4 percentage points
= relative drop: 9.4 / 25.8 ≈ 0.36 → about 36% fewer errors
= first below the human 5.1%: ResNet (2015), 3.6%
## The neural network line
- **Perceptron** (Frank Rosenblatt, ~1957; 1958 on the timeline) — one of the earliest algorithms that could **learn from data**. It was **built in hardware**: weights stored in **potentiometers** and updated by **electric motors** during learning; a camera of **20 × 20 cadmium sulfide photocells** gave a **400-pixel image**; it learned to recognize **letters**. Today we would call it a **linear classifier**.
@diagram cv-neuron
- **Minsky and Papert (1969)** showed that perceptrons **could not learn the XOR function**; this caused a lot of disillusionment in the field.
| x | y | XOR(x, y) |
|---|---|---|
| 0 | 0 | 0 |
| 0 | 1 | 1 |
| 1 | 0 | 1 |
| 1 | 1 | 0 |
Try one straight line: s = x + y − 0.5, and predict 1 when s > 0.
= (0, 0): s = −0.5 → 0 ✓
= (0, 1): s = 0.5 → 1 ✓
= (1, 0): s = 0.5 → 1 ✓
= (1, 1): s = 1.5 → 1 ✗ (XOR = 0)
= accuracy = 3 / 4 = 75%
Every line fails on at least one point: the 1s lie on one diagonal of the square and the 0s on the other, so the classes are **not linearly separable**. Solving XOR needs **more than one layer**.
- **Neocognitron** (Fukushima, 1980) — a computational model of the visual system **directly inspired by Hubel and Wiesel**: interleaved **simple cells (convolution)** and **complex cells (pooling)**. It had **no practical training algorithm**, yet it looks a lot like AlexNet more than 32 years later.
- **Backpropagation** (Rumelhart, Hinton and Williams, 1986) — computes **gradients** in neural networks and **successfully trained perceptrons with multiple layers**.
- **LeNet** (LeCun et al., 1998) — **backprop applied to a Neocognitron-like architecture**; it learned to recognize **handwritten digits** and was **deployed commercially by NEC to process handwritten checks**. It is very similar to modern CNNs.
- **2000s, ‘deep learning’** — researchers trained deeper and deeper networks (Hinton and Salakhutdinov, 2006; Bengio et al., 2007; Lee et al., 2009; Glorot and Bengio, 2010), but it was **not a mainstream research topic** yet.
## 2012: AlexNet and the explosion
**AlexNet** (Krizhevsky, Sutskever and Hinton, NeurIPS 2012) takes a **224 × 224 × 3** image, applies **11 × 11 filters with stride 4**, then 5 × 5 and 3 × 3 convolutions with **max pooling**, two **dense** layers of 4096 units and **1000 outputs** — one score per ImageNet class. It is drawn as two halves because it was trained on **two GPUs**.
Why it worked in 2012 and not in 1980 — the lecture names **three ingredients**:
| Ingredient | What was ready by 2012 |
|---|---|
| Algorithms | backprop and convolutional architectures (Neocognitron → LeNet → AlexNet) |
| Data | ImageNet: about 1.4 million labelled images in 1,000 classes |
| Computation | GPUs: about 3–4 GFLOPs per dollar for the GTX 580 used by AlexNet, about 15 for the GTX 1080 Ti (2017); CPUs stayed below about 2 |
After 2012 Google searches for ‘deep learning’ and the number of papers at the top computer vision conference shot up. The **2018 Turing Award** went to **Yoshua Bengio, Geoffrey Hinton and Yann LeCun**.
> The ideas are old (1959 cells, 1958 perceptron, 1980 Neocognitron, 1986 backprop, 1998 LeNet); deep learning won in 2012 because these algorithms finally met big labelled data and cheap GPU computation.
## Check yourself
?? Why can a single perceptron not learn the XOR function? You may describe a small drawing.
?= A perceptron is a linear classifier: it separates the classes with one straight line. For XOR the points (0, 1) and (1, 0) are class 1 and (0, 0), (1, 1) are class 0; they lie on opposite diagonals, so no single line separates them — at least two layers are needed.
?? The Neocognitron (1980) looked a lot like AlexNet (2012). Why did deep learning only take off in 2012?
?= The Neocognitron had no practical training algorithm. By 2012 there was backpropagation, a big labelled dataset (ImageNet, about 1.4 million images in 1,000 classes) and cheap GPU computation, so AlexNet could be trained and cut the ImageNet top-5 error from 25.8% to 16.4%.

# The task, the semantic gap, challenges and datasets

## The task: image classification
**Image classification** is a core computer vision task. **Input**: an image. **Output**: one label from a **fixed set of categories**, for example {cat, bird, deer, dog, truck}.
The categories are decided in advance; the classifier only chooses among them and never invents a new label.
## The semantic gap
A person sees a cat; the computer sees **just a big grid of numbers between 0 and 255**. The distance between the meaning ("a cat") and these raw numbers is called the **semantic gap**.
The slide's example is an image of **800 × 600 × 3** (three colour channels). In OpenCV a photo 800 pixels wide and 600 pixels high is an array of shape (height, width, channels):
= img = cv2.imread('cat.jpg')
= img.shape -> (600, 800, 3)   # dtype uint8, values 0..255, channel order B, G, R
= 600 * 800 * 3 = 1 440 000 numbers
@diagram cv-image-array
- The slide says RGB; OpenCV stores the same three channels in the order **BGR**.
- **Grayscale** keeps one channel: shape (600, 800), three times fewer numbers, but the colour information is gone.
- A CIFAR-10 image is 32 × 32 × 3 = **3 072** numbers — this vector is the input of the linear classifier in the next lecture.
## Why it is hard: the challenges
A small change in the scene can change **almost every pixel** while the label stays the same. A good classifier must be **robust (invariant)** to all of these:
| Challenge | What changes | Example from the slides |
|---|---|---|
| Viewpoint variation | all pixels change when the camera moves | the same cat seen from another angle |
| Intraclass variation | objects of one class look very different | kittens with different colours and fur patterns |
| Fine-grained categories | different classes look very similar | Maine Coon vs Ragdoll vs American Shorthair |
| Background clutter | the object blends into the background | a tabby cat in autumn leaves, a white cat in snow |
| Illumination changes | lighting changes the brightness of every pixel | a dark cat in shadow, a cat backlit by the sun |
| Deformation | the object takes many shapes | cats lying, stretching, sitting upright |
| Occlusion | only part of the object is visible | a cat under a blanket, only a tail sticking out from a sofa |
![Six photos of tabby cats in a 3 by 2 grid: a cat seen from high above, a cat in deep shadow lit from one side, a cat lying on its back with paws stretched out, a cat half hidden under a knitted blanket, a cat camouflaged among brown autumn leaves, a white-and-grey cat sitting in bright snow](/events/cv/l2-cat-challenges.webp)
The same challenges explain why **data collection and preprocessing** matter in practice:
- **illumination changes** → normalize brightness and contrast, collect photos under different lamps;
- **viewpoint, deformation, occlusion** → collect varied examples and use augmentation (crops, flips, small rotations);
- **background clutter** → crop to the object when possible, include varied backgrounds in training;
- **fine-grained categories** → keep enough resolution and colour: small details decide the class.
## Why classification matters
- **Directly useful**: medical imaging (Levy et al., 2016), galaxy classification (Dieleman et al., 2014), whale recognition (a Kaggle challenge).
- **A building block for other tasks** — many tasks become "classify again and again":
| Task | What is classified at each step |
|---|---|
| Object detection | each image region: background, horse, person, car, truck… |
| Image captioning | the next word: man → riding → horse → STOP |
| Playing Go | the next move: one of the 19 × 19 board positions |
## Why not hard-code a classifier?
Unlike sorting a list of numbers, there is **no obvious way to hard-code** the algorithm for recognizing a cat. You could try rules: **find edges** (e.g. with the Canny edge detector), then **find corners**, then … what?
Hand-written rules break on every challenge above and must be rewritten for each new class, so this approach does not scale.
## The data-driven approach
- **1. Collect** a dataset of images and labels.
- **2. Train** a classifier with machine learning.
- **3. Evaluate** the classifier on **new** images.
The program now has two functions instead of one:
= def train(images, labels): ... return model
= def predict(model, test_images): ... return test_labels
## Image classification datasets
| Dataset | Classes | Images | Image size | Remember |
|---|---|---|---|---|
| MNIST | 10 digits (0–9) | 50k train, 10k test | 28 × 28 grayscale | the Drosophila of CV |
| CIFAR-10 | 10 | 50k train (5k per class), 10k test (1k per class) | 32 × 32 RGB | used for homework |
| CIFAR-100 | 100 | 50k train (500 per class), 10k test (100 per class) | 32 × 32 RGB | 20 superclasses × 5 classes |
| ImageNet | 1000 | ~1.3M train, 50k val, 100k test | variable, often resized to 256 × 256 | top-5 accuracy |
| MIT Places | 365 scene types | ~8M train, 18.25k val, 328.5k test | variable, often 256 × 256 | scenes, not objects |
| Omniglot | 1623 characters from 50 alphabets | 20 images per category | handwritten characters | few-shot learning |
- **MNIST** is called the **Drosophila of computer vision**: like the fruit fly in biology it is small and cheap to experiment on, but results from MNIST **often do not hold** on more complex datasets.
- **CIFAR-10** classes: airplane, automobile, bird, cat, deer, dog, frog, horse, ship, truck.
- **CIFAR-100** groups its 100 classes into **20 superclasses of 5**: aquatic mammals = beaver, dolphin, otter, seal, whale; trees = maple, oak, palm, pine, willow.
- **ImageNet**: ~1.3K training images per class, 50 per class for validation, 100 per class for test; the **test labels are secret**. A 22k-category version exists but is less commonly used.
- **Top-5 accuracy** (ImageNet's metric): the algorithm predicts 5 labels for each image, and the answer counts as correct if **one of them** is the true label. Top-1 accuracy counts only the first guess.
- **Places**: 50 validation and 900 test images per class.
- **Omniglot** has only 20 images per category, so it tests **few-shot learning** — learning a class from a handful of examples.
Quick numbers you can be asked to compute:
= CIFAR-10 train per class: 50 000 / 10 = 5 000
= CIFAR-100 train per class: 50 000 / 100 = 500
= ImageNet validation: 1 000 classes * 50 = 50 000 images
= CIFAR-10 pixels: 50 000 images * 32 * 32 * 3 = 153 600 000 ≈ 154M
| Dataset | Training pixels |
|---|---|
| MNIST | ~47M |
| CIFAR-10 | ~154M |
| CIFAR-100 | ~154M |
| ImageNet | ~251B |
| Places365 | ~1.6T |
CIFAR-10 and CIFAR-100 have the **same** number of pixels: the same 50k images of the same size, only cut into more classes (so fewer examples per class).
> Image classification maps a grid of 0–255 numbers to one label from a fixed set; because of the semantic gap and its challenges, we learn the mapping from data (collect → train → evaluate) instead of hard-coding rules.
## Check yourself
?? A student collects 3 000 photos of 5 kinds of fruit in a shop, under different lamps and from different angles. Name two challenges from the lecture that this dataset shows and how you would handle each.
?= Illumination changes — normalize brightness and contrast (or equalize the histogram) and keep varied lighting in training; viewpoint variation — collect photos from many angles and augment with flips, crops and small rotations. Background clutter or occlusion with a matching fix also earn full points.
?? Why can't image classification be written as a hand-coded algorithm, like sorting a list?
?= Because of the semantic gap: the input is only a grid of 0–255 numbers, and viewpoint, lighting, deformation, occlusion and intraclass variation change almost every pixel without changing the label, so fixed rules (edges → corners → …) fail. Instead we use the data-driven approach: collect labelled images, train a classifier, evaluate it on new images.

# Nearest neighbor and kNN: distances, boundaries, speed

## The first classifier: nearest neighbor
The **nearest neighbor (NN)** classifier is the simplest data-driven method:
- **train**: memorize all training images and their labels — nothing else happens;
- **predict**: for each test image, find the **most similar** training image and return **its label**.
"Most similar" needs a **distance metric**: a number that is small when two images are alike and large when they differ.
## L1 distance, worked example from the slide
The **L1 (Manhattan) distance** compares two images **pixel by pixel** and adds up the absolute differences:
= d1(I1, I2) = sum over all pixels p of |I1[p] - I2[p]|
The slide compares a 4 × 4 test image with a 4 × 4 training image (each table row is one row of pixels):
| Test image row | Training image row | Absolute differences |
|---|---|---|
| 56, 32, 10, 18 | 10, 20, 24, 17 | 46, 12, 14, 1 |
| 90, 23, 128, 133 | 8, 10, 89, 100 | 82, 13, 39, 33 |
| 24, 26, 178, 200 | 12, 16, 178, 170 | 12, 10, 0, 30 |
| 2, 0, 255, 220 | 4, 32, 233, 112 | 2, 32, 22, 108 |
= row 1: 46 + 12 + 14 + 1 = 73
= row 2: 82 + 13 + 39 + 33 = 167
= row 3: 12 + 10 + 0 + 30 = 52
= row 4: 2 + 32 + 22 + 108 = 164
= d1 = 73 + 167 + 52 + 164 = 456
Note the **absolute value**: 10 − 24 = −14 counts as **+14**. Without it, positive and negative differences would cancel out.
## L2 distance
The **L2 (Euclidean) distance** squares the differences, adds them up and takes the square root:
= d2(I1, I2) = sqrt( sum over all pixels p of (I1[p] - I2[p])^2 )
A tiny example with two 3-pixel images a = [10, 20, 30] and b = [13, 16, 30]:
= differences: |10 - 13| = 3, |20 - 16| = 4, |30 - 30| = 0
= L1 = 3 + 4 + 0 = 7
= L2 = sqrt(3^2 + 4^2 + 0^2) = sqrt(9 + 16 + 0) = sqrt(25) = 5
| Property | L1 (Manhattan) | L2 (Euclidean) |
|---|---|---|
| Formula | sum of absolute differences | square root of the sum of squared differences |
| Points at distance 1 from the centre | a diamond (a square turned 45°) | a circle |
| One big difference | counts as it is | counts more, because it is squared |
| Rotating the coordinate axes | changes the distance | does not change it |
| NN boundaries in 2-D | pieces that are horizontal, vertical or at 45° | straight pieces at any angle |
## The code from the slide (NumPy)
The training set is a matrix **Xtr** of shape N × D: one flattened image per row (N images, D pixels each); **ytr** holds the N labels.
= self.Xtr = X    # train: just memorize the data
= self.ytr = y
= distances = np.sum(np.abs(self.Xtr - X[i, :]), axis=1)
= min_index = np.argmin(distances)
= Ypred[i] = self.ytr[min_index]
- **self.Xtr − X[i, :]** subtracts the i-th test image from **every** training row at once (broadcasting) → an N × D matrix;
- **np.abs** and **np.sum(…, axis=1)** add the absolute differences along each row → **N distances**, shape (N,);
- **np.argmin** gives the index of the **smallest** distance, and the label at that index is the prediction (np.argmax would pick the most different image);
- for L2 the distance line becomes np.sqrt(np.sum(np.square(self.Xtr − X[i, :]), axis=1)).
## How fast is it?
| Step | Time with N training examples | Why |
|---|---|---|
| Training | O(1) | it only stores the data |
| Prediction (one test image) | O(N) | it compares the test image with all N training images |
This is **bad**: we can afford **slow training** (done once, offline), but we need **fast testing** (every user request, often on a phone). Useful models are usually the other way round: slow to train, fast to predict.
= CIFAR-10: one prediction = 50 000 distances x 3 072 values = 153 600 000 subtractions
= 10 000 test images x 50 000 training images = 500 000 000 distance computations
There are many methods for **fast / approximate nearest neighbors**, e.g. the **FAISS** library (github.com/facebookresearch/faiss).
## What do the nearest neighbors look like?
On CIFAR-10 the slide shows each test image with its 10 nearest training images by pixel distance. Many neighbours belong to the **wrong class** (red frames on the slide): they share the overall **colour, brightness and background**, not the object.
## Decision boundaries
@diagram cv-knn
The slides draw NN in two dimensions (features x0 and x1):
- **points** are training examples; their **colours** are the training labels;
- **background colours** give the category a test point at that position would be assigned;
- the **decision boundary** is the boundary between two classification regions.
With one neighbour the boundaries are **noisy** and **affected by outliers**: a single yellow point inside the green cloud creates a yellow island around itself. How to smooth them? **Use more neighbours.**
## K-nearest neighbors (kNN)
Instead of copying the label from the single nearest neighbour, take a **majority vote** among the **K closest points**.
- More neighbours **smooth out rough decision boundaries**.
- More neighbours **reduce the effect of outliers**: one mislabelled point is outvoted.
- With K > 1 there can be **ties** between classes (white regions on the slide) — they must be broken somehow: e.g. the closest neighbour decides, or an odd K is used for two classes.
Worked vote — the five training points nearest to a query point, sorted by distance:
| Rank | Distance | Label |
|---|---|---|
| 1 | 1.0 | cat |
| 2 | 1.5 | dog |
| 3 | 2.0 | dog |
| 4 | 2.5 | cat |
| 5 | 3.0 | cat |
= K = 1: neighbour 1 -> cat
= K = 3: cat 1, dog 2 -> dog
= K = 5: cat 3, dog 2 -> cat
The same query gets **different answers for different K**, so K must be chosen carefully (part 3).
## The distance metric decides what similar means
The slides compare L1 and L2 with K = 1 on the same points: the regions differ, because "nearest" depends on the metric.
With the right choice of distance metric, kNN can be applied to **any type of data** — for example research papers compared with **tf-idf similarity** (the "show similar" button of arxiv-sanity). The web demo (vision.stanford.edu/teaching/cs231n-demos/knn) lets you move points, switch between L1 and L2 and change K and the number of points.
> Nearest neighbor memorizes the training data (training O(1)) and compares every test image with all N training images (prediction O(N)); kNN takes a majority vote of the K closest points, which smooths boundaries and resists outliers.
## Check yourself
?? Compute the L1 and the L2 distance between a = [2, 8, 5] and b = [8, 0, 5]. Show the steps.
?= |2 − 8| = 6, |8 − 0| = 8, |5 − 5| = 0, so L1 = 6 + 8 + 0 = 14 and L2 = √(6² + 8² + 0²) = √(36 + 64) = √100 = 10.
?? A nearest neighbor classifier stores 1 000 000 training images. How fast are its training and its prediction, and why is this a problem for a phone app?
?= Training is O(1) — it only memorizes the data — but each prediction is O(N): the test image is compared with all 1 000 000 training images, which is slow and needs the whole dataset in memory. We want the opposite (slow training is fine, testing must be fast), so one uses approximate nearest neighbors (e.g. FAISS) or a parametric model.

# Hyperparameters, data splits, cross-validation and the limits of kNN

## Hyperparameters
What is the best value of **K**? What is the best **distance metric**? These are **hyperparameters**: choices about the learning algorithm that we **don't learn from the training data**; instead we **set them at the start** of the learning process.
| | Hyperparameter | Parameter |
|---|---|---|
| Who sets it | you, before training | the learning algorithm, during training |
| Examples | K, L1 vs L2 (later: learning rate, regularization strength λ) | the weights W and bias b of a linear classifier (next lecture) |
| How to choose it | try values, compare them on validation data | fit it to the training data |
Hyperparameters are **very problem-dependent**: in general you need to **try them all** and see what works best for your data and task.
## Setting hyperparameters: four ideas
| Idea | What you do | Verdict |
|---|---|---|
| #1 | choose what works best on **your whole dataset** (used for training) | **BAD**: K = 1 always works perfectly on training data |
| #2 | split into **train** and **test**; choose what works best on **test** | **BAD**: no idea how the algorithm will perform on new data |
| #3 | split into **train, validation and test**; choose on **validation**, evaluate on **test** | **Better!** |
| #4 | **cross-validation**: split into folds, try each fold as validation, average | most reliable; useful for small datasets |
- Why idea #1 fails: with K = 1 every training image is its **own nearest neighbour** (distance 0), so training accuracy is always 100% — it says nothing about new images.
- Why idea #2 fails: once the test set was used to **choose** K, the test score is **optimistic**; it no longer measures performance on truly **new** data.
- Idea #3: train on **train**, pick hyperparameters on **validation**, and run on the **test set only once, at the very end**.
@diagram cv-data-split
## Splits with numbers (exam style)
= 2 000 images, 80 / 20: 2 000 * 0.8 = 1 600 train, 2 000 * 0.2 = 400 test
= 2 000 images, 70 / 15 / 15: 1 400 train, 300 validation, 300 test
= 4 classes x 500 images, stratified 70 / 15 / 15: per class 350 / 75 / 75
- **Stratified split**: split **each class separately**, so every class keeps the same share in train, validation and test.
- Organize the files **one folder per class**, e.g. data/train/plastic/, data/val/plastic/, data/test/plastic/.
- Test images must never be seen during training or tuning — no duplicates or near-duplicates across the splits.
## Cross-validation
In **5-fold cross-validation** the data (with the test set kept aside) is split into **5 folds**. For each hyperparameter value we train **5 times**: each time 4 folds are used for training and the remaining fold for validation; then the 5 results are **averaged**.
= 1 000 images, 5 folds: each run trains on 800 and validates on 200
= fold accuracies 0.80, 0.84, 0.78, 0.82, 0.86 -> mean = 4.10 / 5 = 0.82
- Useful for **small datasets**, but (unfortunately) **not used too frequently in deep learning**: training a big network 5 times per setting is too expensive.
- The slide's plot is 5-fold cross-validation for the value of **k**: each point is a single outcome, the line goes through the **mean**, the bars show the **standard deviation**; here **k ≈ 7** works best.
| Method | Training runs per setting | Best for |
|---|---|---|
| Train / validation / test | 1 | large datasets, deep learning |
| k-fold cross-validation | k (e.g. 5) | small datasets, cheap models like kNN |
## Universal approximation
As the number of training samples goes to **infinity**, nearest neighbor can represent **any function** — subject to many technical conditions: only **continuous functions on a compact domain**, with assumptions about the spacing of the training points, etc.
- The slides fit a curve with the NN function (a **step function**) using **5, 10, 20 and 100** training points: the more points, the closer the steps follow the true curve.
- So in theory NN can learn anything; in practice it needs **enough points to cover the space** — and that is the problem.
## The curse of dimensionality
**Curse of dimensionality**: for **uniform coverage** of space, the number of training points needed **grows exponentially with the dimension**.
| Dimensions | Points for 4 per axis |
|---|---|
| 1 | 4 |
| 2 | 4² = 16 |
| 3 | 4³ = 64 |
| D | 4 to the power D |
= possible 32x32 binary images: 2^(32*32) = 2^1024 ≈ 10^308
= elementary particles in the visible universe ≈ 10^97
Even tiny black-and-white 32 × 32 images have vastly more possible values than there are particles in the universe, so no dataset can cover image space densely; real images have thousands of dimensions (3 072 for CIFAR-10).
## kNN on raw pixels is seldom used
- **Very slow at test time** (O(N) per prediction).
- **Distance metrics on pixels are not informative**: a **boxed** copy (black rectangles over parts), a **shifted** copy and a **tinted** copy of one photo all have the **same L2 distance** to the original, although a person sees them very differently.
![Four versions of the same photo of a red apple on a plain grey table, side by side: the original; the same photo with three black rectangles covering parts of the apple; the photo shifted a few pixels to the right; the photo with a blue-green colour tint](/events/cv/l2-apple-boxed-shifted-tinted.webp)
- Exam link: photos of the same object taken with **another phone** (other colours, brightness, resolution) can be **far away in pixel space** — raw-pixel distances suffer badly from this **domain shift**.
## Nearest neighbor with ConvNet features works well
Instead of raw pixels, compare **feature vectors computed by a convolutional network (ConvNet)**. Then nearest neighbours are semantically similar: food → food, trains → trains, babies → babies, elephants → elephants.
- Example: **image captioning with nearest neighbor** (Devlin et al., 2015) — find the closest training image in feature space and reuse its caption, e.g. "A cat sitting in a bathroom sink".
| | kNN on raw pixels | kNN on ConvNet features |
|---|---|---|
| What is compared | pixel values 0–255 | learned feature vectors |
| Shift, tint, small occlusion | large change in distance | small change |
| Typical neighbours | similar colours and background | the same kind of object or scene |
| Used in practice | seldom | yes: retrieval, captioning |
## Overfitting and generalization
A K = 1 model with 100% training accuracy is the extreme case of **overfitting**: perfect on what it has seen, worse on new data. The same pattern appears later with any model:
= train accuracy 95%, test accuracy 62% -> gap 33 points -> overfitting (poor generalization)
- Fixes: more data or augmentation, regularization (L2 weight decay, dropout), a simpler model (for kNN: a larger K), early stopping.
- Tune all of this on the **validation** set, never on the test set.
## Summary of the lecture
- In image classification we start with a training set of images and labels and must predict labels on the test set.
- It is challenging because of the **semantic gap**: we need invariance to occlusion, deformation, lighting, intraclass variation, etc.
- Image classification is a **building block** for other vision tasks.
- The **K-nearest neighbors** classifier predicts labels from the nearest training examples.
- **Distance metric and K are hyperparameters**.
- Choose hyperparameters using the **validation set**; only run on the **test set once at the very end**.
> Hyperparameters such as K and the distance metric are chosen on a validation set (or by cross-validation), never on the test set; kNN on raw pixels is slow and its pixel distances are not meaningful, but kNN on ConvNet features works well.
## Check yourself
?? A student tries K = 1, 3, 5, 7, 9, picks the K with the best test accuracy and reports that accuracy as the final result. What is wrong, and what should be done instead?
?= The test set was used to choose a hyperparameter, so the reported score is optimistic and says nothing about truly new data. Split into train / validation / test (or use cross-validation on the training data), choose K on validation, and evaluate on the test set only once at the end.
?? You have 2 000 images of 4 waste classes (500 each). Propose a train / validation / test split, give the counts, and say how you would choose K for kNN.
?= For example 70 / 15 / 15, stratified per class: 1 400 train, 300 validation, 300 test (350 / 75 / 75 per class). Try several K (and L1 vs L2), keep the one with the best validation accuracy (or use 5-fold cross-validation on the training part), then report test accuracy once.

# The linear classifier: f(x, W) = Wx + b and three viewpoints

## From kNN to a parametric model
**kNN** keeps every training image and compares a test image with all of them, so prediction is slow — O(N) for N training images.
The **parametric approach** squeezes what was learned from the training data into **parameters W** (weights). After training the images can be thrown away, and a prediction is one fast formula.
The simplest such formula is the **linear classifier** — the basic building block that neural networks stack many times.
## The score function f(x, W) = Wx + b
= f(x, W) = Wx + b
- **x** — the image stretched into one long column of pixel values;
- **W** — the weight matrix, **one row per class**;
- **b** — the **bias** vector, one number per class;
- **f(x, W)** — the vector of **class scores**; the predicted class is the **argmax**, the class with the largest score.
For **CIFAR-10** (50 000 training and 10 000 test images, each 32×32×3, 10 classes) the shapes are:
| Symbol | Meaning | Shape |
|---|---|---|
| x | image stretched into a column | (3072,) |
| W | weights, one row per class | (10, 3072) |
| b | bias, one number per class | (10,) |
| f(x, W) | class scores | (10,) |
= 32 × 32 × 3 = 3072
= params = 10 · 3072 + 10 = 30720 + 10 = 30730
## Worked example: a 2×2 image, 3 classes
The slide's image has four pixels 56, 231, 24, 2 and three classes: cat, dog, ship. Stretch the pixels into a column, multiply each row of W by it and add the bias:
= x = [56, 231, 24, 2]
= W = [[0.2, −0.5, 0.1, 2.0], [1.5, 1.3, 2.1, 0.0], [0, 0.25, 0.2, −0.3]]
= b = [1.1, 3.2, −1.2]
= cat:  0.2·56 + (−0.5)·231 + 0.1·24 + 2.0·2 + 1.1 = 11.2 − 115.5 + 2.4 + 4.0 + 1.1 = −96.8
= dog:  1.5·56 + 1.3·231 + 2.1·24 + 0.0·2 + 3.2 = 84.0 + 300.3 + 50.4 + 0 + 3.2 = 437.9
= ship: 0·56 + 0.25·231 + 0.2·24 + (−0.3)·2 − 1.2 = 0 + 57.75 + 4.8 − 0.6 − 1.2 = 60.75
- The slide prints **61.95** for ship: that is Wx **before** the bias −1.2 is added; the full score is 60.75.
- The picture is a cat, but **dog** wins with 437.9. This W is bad — we need a way to measure how bad (a **loss**) and to improve it.
## Exam format: s = Wx + b by hand
@diagram cv-linear
For revision, show every step. Multiply each row of W by x, then add that row's bias:
= W = [[1, 2], [−1, 1], [2, −1]],   x = [2, −1],   b = [0, 1, −1]
= s0 = 1·2 + 2·(−1) + 0 = 2 − 2 + 0 = 0
= s1 = (−1)·2 + 1·(−1) + 1 = −2 − 1 + 1 = −2
= s2 = 2·2 + (−1)·(−1) − 1 = 4 + 1 − 1 = 4
= s = [0, −2, 4]   →   argmax = 2   →   Bird
- Check the shapes first: W (3, 2) times x (2,) gives (3,); adding b (3,) gives one score per class.
- **W** holds the learned weights: row k says how strongly each input value pushes the score of class k up (positive weight) or down (negative weight). Each row works as a **template** for its class.
- **b** is a per-class offset that does not depend on the image: it raises or lowers a class score for every input, for example toward classes that are frequent in the data.
## The bias trick
Add an extra **1** at the end of x and put b in as the **last column** of W — then one matrix product does everything:
= [W | b] · [x; 1] = Wx + b
= W (3, 4), b (3,)  →  W' (3, 5);   x (4,)  →  x' = [56, 231, 24, 2, 1] (5,)
## Predictions are linear
Ignoring the bias, scaling the image scales every score by the same factor:
= f(cx, W) = W(cx) = c · f(x, W)
= f(x, W) = [−96.8, 437.8, 62.0]   →   f(0.5x, W) = [−48.4, 218.9, 31.0]
- A darker copy of the photo gets proportionally smaller scores, but for c > 0 the **order of the scores stays the same**, so the predicted class does not change.
## Three ways to look at a linear classifier
| Viewpoint | What you look at | Key idea |
|---|---|---|
| Algebraic | f(x, W) = Wx + b | matrix times vector plus bias |
| Visual | each row of W reshaped into an image | one **template** per class; the score is how well the image matches it |
| Geometric | each row of W as a direction in pixel space | **hyperplanes** cutting up a 3072-dimensional space |
- **Visual**: the score is a dot product of a template and the image, so the classifier does **template matching**. Learned CIFAR-10 templates look like blurry average pictures: a blue background for planes and ships, a reddish blob for cars.
- One template cannot capture **multiple modes** of a class: the **horse template has two heads**, because horses in the data face both left and right.
- **Geometric**: vary one pixel, e.g. (15, 8, 0), keep the rest fixed, and each class score moves along a **straight line**. In the full space the images where the car score equals 0 form a **hyperplane**; the car score grows in the direction of the car row of W.
![A row of ten small, square, blurry colour patches like the class templates a linear classifier learns from tiny 32×32 photos: a bluish patch with a pale sky border, a reddish car-shaped blob on grey, a greenish-brown blob, a brown horse-like blob with a head on both the left and the right side, a blue patch with a darker sea-blue bottom and five more muted patches](/events/cv/l3-linear-templates.webp)
## Hard cases for a linear classifier
Every boundary of a linear classifier is a straight cut (a hyperplane), so it fails on 2-D datasets like these:
| Dataset | Why a straight cut fails |
|---|---|
| class 1 in quadrants 1 and 3, class 2 in quadrants 2 and 4 | you would need two crossing lines |
| class 1 is a ring: 1 ≤ L2 norm ≤ 2, class 2 is everything else | the boundary is two circles, not a line |
| class 1 is three separate blobs (three modes) | one half-plane cannot cover three islands |
- The first case is **XOR**: (0, 0) → 0, (0, 1) → 1, (1, 0) → 1, (1, 1) → 0. No single line puts both 1s on one side and both 0s on the other — this is why the **Perceptron could not learn XOR**.
- The fix is a **non-linear** model: hand-made features, or a neural network that stacks layers with non-linear activations.
> f(x, W) = Wx + b gives one score per class (one row of W and one b each) and the largest score wins — but straight hyperplanes cannot separate XOR, rings or multi-modal classes.
## Check yourself
?? Compute s = Wx + b for W = [[2, 0], [1, −1], [0, 3]], x = [1, 2], b = [1, 0, −2] and give the predicted class (0, 1 or 2).
?= s0 = 2·1 + 0·2 + 1 = 3, s1 = 1·1 + (−1)·2 + 0 = −1, s2 = 0·1 + 3·2 − 2 = 4, so s = [3, −1, 4] and the classifier predicts class 2, the one with the largest score.
?? Why can't a single linear classifier correctly separate every possible dataset?
?= Its decision boundaries are straight hyperplanes, so each class gets one convex region; data like XOR, a ring around the origin or a class split into several blobs needs a curved or multi-piece boundary that one Wx + b cannot draw.

# Loss functions and the multiclass SVM loss

## How do we choose a good W?
For any W we can compute scores. The slide shows a linear classifier's 10 CIFAR-10 scores for three test images:
| Image | Score of the true class | Highest other score | Verdict |
|---|---|---|---|
| cat | cat 2.9 | dog 8.02 | wrong |
| car | automobile 6.04 | bird 5.31 | correct |
| frog | frog −4.34 | truck 6.14 | very wrong |
The plan has two steps:
- use a **loss function** to put a number on how good a value of W is;
- find the W that **minimizes** the loss — **optimization** (next lecture).
## Loss function
A **loss function** tells how good the current classifier is: **low loss = good classifier, high loss = bad classifier**.
- Other names: **objective function**, **cost function**.
- The **negative** of a loss is sometimes called a reward, profit, utility or fitness function — that one you maximize.
Given a dataset of N examples (x_i, y_i), where x_i is an image and y_i is its **integer label**:
= L_i = L(f(x_i, W), y_i)
= L = (1/N) · Σ_i L_i
The loss for the whole dataset is the **average** of the per-example losses.
## Multiclass SVM loss (hinge loss)
Idea: **the score of the correct class should be higher than all the other scores — by a margin of at least 1**.
= s = f(x_i, W)
= L_i = Σ_{j ≠ y_i} max(0, s_j − s_{y_i} + 1)
- Every **wrong class j** adds max(0, s_j − s_yi + 1): nothing if the correct score beats it by at least 1, otherwise the size of the shortfall.
- The correct class itself (j = y_i) is **left out** of the sum.
- On the slide's plot (loss against the correct-class score) the loss falls along a straight line and then stays **flat at 0** once the correct score beats the highest other score by the **margin**. The shape looks like a door **hinge** — hence **hinge loss**.
## Worked example: cat, car, frog
Three training images and three classes; the score of the true class is in bold:
| Class | cat image | car image | frog image |
|---|---|---|---|
| cat | **3.2** | 1.3 | 2.2 |
| car | 5.1 | **4.9** | 2.5 |
| frog | −1.7 | 2.0 | **−3.1** |
| SVM loss | 2.9 | 0 | 12.9 |
Cat image (true class cat, score 3.2):
= L_cat = max(0, 5.1 − 3.2 + 1) + max(0, −1.7 − 3.2 + 1)
= L_cat = max(0, 2.9) + max(0, −3.9) = 2.9 + 0 = 2.9
Car image (true class car, score 4.9):
= L_car = max(0, 1.3 − 4.9 + 1) + max(0, 2.0 − 4.9 + 1)
= L_car = max(0, −2.6) + max(0, −1.9) = 0 + 0 = 0
Frog image (true class frog, score −3.1):
= L_frog = max(0, 2.2 − (−3.1) + 1) + max(0, 2.5 − (−3.1) + 1)
= L_frog = max(0, 6.3) + max(0, 6.6) = 6.3 + 6.6 = 12.9
Loss over the dataset:
= L = (2.9 + 0 + 12.9) / 3 = 15.8 / 3 ≈ 5.27
- The cat image is misclassified (car 5.1 > cat 3.2) and pays 2.9; the frog image is badly wrong and pays the most; the car image beats both other classes by more than 1 and pays 0.
![Three square photos side by side on a white background: a grey tabby cat sitting and looking to the side, a red sports car seen from the front, a bright green tree frog with red eyes on a green leaf](/events/cv/l3-cat-car-frog.webp)
## Questions from the slides
| Question | Answer |
|---|---|
| The car image's scores change a little — what happens to its loss? | it stays 0: car (4.9) beats cat and frog by more than the margin |
| Minimum and maximum possible loss? | min 0, max +∞ |
| All scores small and random (almost equal)? | each wrong class adds about max(0, 0 + 1) = 1, so L ≈ C − 1 (2 for 3 classes, 9 for CIFAR-10) |
| Sum over all classes, including j = y_i? | the extra term is always max(0, 1) = 1: the loss grows by 1, the best W does not change |
| Mean instead of sum? | the loss is divided by C − 1: only rescaled, the same W is preferred |
| Squared hinge, max(0, s_j − s_yi + 1)²? | a different loss: big violations cost much more, so it can prefer a different W |
- The value **C − 1** is a handy debugging check: right after initialization the SVM loss should be close to it.
## Is a W with L = 0 unique?
No. If W gives L = 0, then **2W** gives L = 0 too: every score doubles, so every margin only gets bigger. The car image:
= W:   max(0, 1.3 − 4.9 + 1) + max(0, 2.0 − 4.9 + 1) = max(0, −2.6) + max(0, −1.9) = 0
= 2W:  max(0, 2.6 − 9.8 + 1) + max(0, 4.0 − 9.8 + 1) = max(0, −6.2) + max(0, −4.8) = 0
So how should we choose between W and 2W if both are perfect on the training data? That is the job of **regularization** — the next part.
> The multiclass SVM loss is 0 only when the correct score beats every other score by at least 1; each class that breaks the margin adds max(0, s_j − s_yi + 1).
## Check yourself
?? A dog image gets scores cat 1.5, dog 2.0, bird 2.8. Compute its multiclass SVM loss (margin 1).
?= L = max(0, 1.5 − 2.0 + 1) + max(0, 2.8 − 2.0 + 1) = 0.5 + 1.8 = 2.3; even the cat term counts, because dog beats cat by less than the margin.
?? A student finds a W with SVM loss 0 on the training set and says it is the only best W. Is the student right?
?= No: 2W (or any cW with c > 1) multiplies every score difference, so each margin grows and the loss stays 0; regularization is needed to say which of these equal solutions we prefer.

# Regularization: L2, L1 and simpler models

## Beyond training error
On the training data W and 2W can be equally perfect. To choose between them we add a second term to the loss:
= L(W) = (1/N) · Σ_i L_i(f(x_i, W), y_i) + λ · R(W)
| Term | What it says |
|---|---|
| **data loss** (1/N) Σ L_i | model predictions should match the training data |
| **regularization** R(W) | prevent the model from doing *too* well on the training data |
| λ | **regularization strength**, a **hyperparameter** chosen on validation data |
- The data loss looks only at the training set; R(W) looks only at the weights.
- λ = 0 means no regularization; a larger λ means a stronger preference for simple weights.
## Simple and more complex regularizers
| Regularizer | R(W) | What it prefers |
|---|---|---|
| L2 | Σ_k Σ_l W_kl² | small, **spread-out** weights |
| L1 | Σ_k Σ_l abs(W_kl) | **sparse** weights: many exactly 0 |
| Elastic net (L1 + L2) | Σ_k Σ_l (β · W_kl² + abs(W_kl)) | a mix of both |
More complex regularizers, used for neural networks: **dropout**, **batch normalization**, cutout, mixup, stochastic depth.
## Why regularize
- **Express preferences** among models beyond "minimize training error".
- **Avoid overfitting**: prefer **simple models** that **generalize** better to new data.
- **Improve optimization** by adding curvature to the loss.
- L2 regularization of the weights is also called **weight decay**.
## L2 likes to spread out the weights
Two weight vectors give the same score on the same input:
= x = [1, 1, 1, 1]
= w1 = [1, 0, 0, 0]
= w2 = [0.25, 0.25, 0.25, 0.25]
= w1ᵀx = 1 + 0 + 0 + 0 = 1
= w2ᵀx = 0.25 + 0.25 + 0.25 + 0.25 = 1
The data loss cannot tell them apart, but the regularizers can:
= R_L2(w1) = 1² + 0² + 0² + 0² = 1
= R_L2(w2) = 4 · 0.25² = 4 · 0.0625 = 0.25   →   R_L2(w2) < R_L2(w1)
= R_L1(w1) = 1,   R_L1(w2) = 4 · 0.25 = 1   →   R_L1(w1) = R_L1(w2)
- **L2 prefers w2**: it uses every input a little instead of relying on one pixel, so noise in a single pixel barely changes the decision.
- **L1** generally prefers **sparse** solutions with many zero weights (like w1) — useful when only a few features matter. Here it sees a tie.
## Back to W and 2W
Both have data loss 0 on the training set. Under L2, doubling every weight multiplies the penalty by 4:
= R(2W) = Σ_k Σ_l (2 · W_kl)² = 4 · R(W)
= R(W) = 2.5,  λ = 0.1:   L(W) = 0 + 0.1 · 2.5 = 0.25,   L(2W) = 0 + 0.1 · 10 = 1.0
So the regularized loss picks **W** — the solution with smaller weights.
## Prefer simpler models
The slide shows training points (blue) and two models:
- **f1** — a wiggly curve (not a linear model; e.g. polynomial regression) that passes through **every** training point: zero training error.
- **f2** — a straight line with some training error, but **simpler**.
- New points (white) arrive later: they lie close to the line f2, while f1 swings far away from them — f1 has fitted the **noise**.
Regularization **pushes against fitting the data too well**, so we don't fit noise. It is important: you should (usually) use it.
![A simple plot on a white background with a horizontal and a vertical axis line: five blue dots that a wiggly blue curve passes through exactly, a straight green line running close to all of them, and two light-grey dots that lie near the green line but far from the wiggly curve; no labels](/events/cv/l3-simple-vs-wiggly.webp)
## Choosing λ
@diagram cv-overfitting
| λ | What happens | Typical symptom |
|---|---|---|
| 0 or too small | the model fits training noise | train ≫ test, e.g. 95% train vs 62% test (overfitting) |
| well tuned | balance between fit and simplicity | best **validation** accuracy |
| too large | weights pushed toward 0, the data is ignored | train and test both low (underfitting) |
- λ is a hyperparameter: try several values and keep the one with the best **validation** accuracy (or use cross-validation). **Never tune on the test set** — it must stay an honest final estimate.
- **95% train / 62% test** is **overfitting**. Fixes: more data or **augmentation**, **regularization** (L2 weight decay, dropout), a **simpler model**, **early stopping**.
> Full loss = data loss + λ · R(W): the data loss fits the training set, while the regularizer (L2 prefers small, spread-out weights) keeps the model simple so it generalizes.
## Check yourself
?? x = [1, 1, 1, 1], w1 = [1, 0, 0, 0], w2 = [0.25, 0.25, 0.25, 0.25]. Both give score 1. Which one does L2 regularization prefer, and why?
?= R(w1) = 1 and R(w2) = 4 · 0.25² = 0.25, so L2 prefers w2: it spreads the weight over all inputs, so no single (possibly noisy) pixel dominates the decision.
?? A model reaches 95% training accuracy but only 62% test accuracy. Name the problem and explain how regularization helps.
?= This is overfitting — the model memorized training noise and does not generalize. Adding or increasing λ · R(W) (L2 weight decay, dropout) penalizes complex solutions, trading a little training accuracy for better test accuracy; λ is tuned on a validation set.

# Softmax and cross-entropy loss

## From scores to probabilities
The SVM loss treats scores as plain numbers. Often we want to read the raw classifier scores as **probabilities**.
- Raw scores are **unnormalized log-probabilities**, also called **logits**: any real number, positive or negative, with no bound.
- A probability must be **≥ 0**, and the probabilities of all classes must **sum to 1**.
The **softmax function** does both in two steps — exponentiate, then normalize:
= P(Y = k | X = x_i) = exp(s_k) / Σ_j exp(s_j)
@diagram cv-softmax
## Worked example: the cat image
| Class | Score (logit) | exp(score) | Probability |
|---|---|---|---|
| cat | 3.2 | 24.5 | 0.13 |
| car | 5.1 | 164.0 | 0.87 |
| frog | −1.7 | 0.18 | 0.00 |
= e^3.2 ≈ 24.5,   e^5.1 ≈ 164.0,   e^(−1.7) ≈ 0.18
= sum = 24.5 + 164.0 + 0.18 = 188.68
= P(cat) = 24.5 / 188.68 ≈ 0.13
= P(car) = 164.0 / 188.68 ≈ 0.87
= P(frog) = 0.18 / 188.68 ≈ 0.001 ≈ 0.00
- **exp** turns every score, even a negative one, into a positive number; dividing by the sum makes the values add up to 1.
- The largest score still gets the largest probability, so the **predicted class does not change** — car here, a wrong prediction for a cat.
## Cross-entropy loss
Train the model to **maximize the probability of the correct class**, that is, to minimize its negative log:
= L_i = −log P(Y = y_i | X = x_i) = −log( exp(s_{y_i}) / Σ_j exp(s_j) )
= L_cat = −log(0.13) ≈ 2.04
- The log is the **natural** log (ln): −ln 0.13 ≈ 2.04, and log 10 ≈ 2.3 below.
- Why "cross-entropy": compare the predicted distribution [0.13, 0.87, 0.00] with the **correct** one [1.00, 0.00, 0.00]. The **cross-entropy** H(P, Q) = −Σ_y P(y) log Q(y) measures how far apart they are (it is closely related to the **Kullback–Leibler divergence**); with a one-hot target it is just −log Q(y_i).
- This is **maximum likelihood estimation**: choose the weights that maximize the likelihood of the observed labels. The model is also called **multinomial logistic regression**.
## Min, max and the loss at initialization
| Situation | P(correct class) | Loss −log P |
|---|---|---|
| correct score far above the others | → 1 | → 0 |
| correct score far below the others | → 0 | → +∞ |
| all scores small random values | ≈ 1/C | ≈ log C |
- **Min 0, max +∞.** The loss reaches 0 only in the limit: with finite scores P(correct) is never exactly 1.
- With small random weights at the start of training all scores are about equal, so P ≈ 1/C and the loss is about **log C**:
= C = 10:   −log(1/10) = log 10 ≈ 2.3
= C = 3:    −log(1/3) = log 3 ≈ 1.1
- **Sanity check**: if the first iteration on CIFAR-10 does not give a loss near 2.3, look for a bug.
## Cross-entropy vs SVM loss
Three examples with correct class y_i = 0 (its score is 10 every time):
| Scores | SVM loss | Cross-entropy loss |
|---|---|---|
| [10, −2, 3] | 0 | ≈ 0.0009 |
| [10, 9, 9] | 0 | ≈ 0.55 |
| [10, −100, −100] | 0 | ≈ 3·10⁻⁴⁸ (tiny, but > 0) |
= [10, 9, 9]:   P(0) = e^10 / (e^10 + e^9 + e^9) = 1 / (1 + 2/e) ≈ 0.576,   L = −log 0.576 ≈ 0.55
- **Change the last example's scores slightly** → the cross-entropy loss changes (by a tiny amount); the SVM loss **stays 0**, because the margins are met by far.
- **Double the correct score from 10 to 20** → cross-entropy **decreases**; the SVM loss **is still 0**.
- The SVM is satisfied as soon as the margins are met and stops caring; cross-entropy **always** wants the correct probability closer to 1.
## Scores vs probabilities (exam favourite)
| | Class score (logit) | Class probability (softmax) |
|---|---|---|
| Range | any real number, can be negative | between 0 and 1 |
| Sum over classes | anything | exactly 1 |
| Comes from | s = Wx + b | exp of the scores, then normalize |
| Predicted class | argmax of the scores | the same argmax |
Exam numbers: s = [0, −2, 4] for Cat, Dog, Bird:
= exp(s) = [1, 0.135, 54.6],   sum ≈ 55.7,   P ≈ [0.018, 0.002, 0.980]   →   Bird
## The full picture
- A dataset of (x, y), a **score function** s = f(x; W) = Wx, and a **loss function** — softmax (cross-entropy) or SVM — plus regularization:
= L = (1/N) · Σ_i L_i + λ · R(W)
- The next question: **how do we find the best W?** That is optimization.
> Softmax turns logits into probabilities (exp, then normalize) without changing the argmax; cross-entropy −log P(correct) is ≈ log C at the start, 0 only in the limit, and — unlike the SVM loss — never stops pushing.
## Check yourself
?? A cat image gets scores cat 3.2, car 5.1, frog −1.7. Compute the softmax probabilities and the cross-entropy loss.
?= exp gives 24.5, 164.0 and 0.18 (sum ≈ 188.7), so P ≈ 0.13, 0.87, 0.00; the loss is −ln 0.13 ≈ 2.04 — high, because most of the probability went to car.
?? Explain the difference between a class score and a class probability.
?= A score (logit) is a raw output of Wx + b — any real number, unbounded and not summing to anything; softmax turns scores into probabilities between 0 and 1 that sum to 1, and the predicted class (argmax) stays the same.

# Neural networks: neurons, layers, activations and the forward pass

## Where linear classifiers stop
The classifier from Lecture 3 is **f(x) = Wx + b**: one row of W per class, so **one template per class**.
- **One template per class** — a horse facing left and a horse facing right must share one template, so the model learns a blurry **two-headed average**.
- **Only straight boundaries** — each class is cut off by a **hyperplane**; data like **XOR** or **concentric rings** cannot be split by any line.
The question of this lecture: how do we get **several templates per class** and **curved decision boundaries**? Answer: stack linear layers with a **non-linear activation** between them.
## Biological neuron vs artificial neuron
| Biological neuron | Artificial neuron |
|---|---|
| dendrites receive signals | inputs x₁ … xₙ |
| synapse strength | weight wᵢ |
| cell body integrates the signals | weighted sum Σ wᵢxᵢ + b |
| fires if a threshold is reached | activation g adds non-linearity |
| axon sends the spike on | output a feeds the next layer |
| synapses change with experience | weights change during training |
![A stylized biological neuron in soft blue light: branching dendrites on the left, a round cell body in the centre, a long axon stretching to the right and ending in small synapse terminals that touch the dendrites of a second neuron, dark background](/events/cv/l4-biological-neuron.webp)
| Parameter | Artificial (ANN) | Biological (BNN) |
|---|---|---|
| Structure | layers: input, hidden, output | dendrites, cell body, axon |
| Learning | an algorithm adjusts the weights | experience changes the synapses |
| Data | needs many labelled examples | copes with noisy, unlabelled input |
| Processing | digital, fast, on GPUs | electrochemical, slower, massively parallel |
| Adaptivity | mostly fixed after training | learns continuously |
| Efficiency | training uses huge amounts of energy | about 20 W, fault-tolerant |
Neural networks are **inspired by the brain, not a model of it**. A human brain has about **86 billion neurons** and runs on about **20 W**; real neurons use spikes, timing and chemistry, while an artificial neuron is **one formula: g(w·x + b)**.
## Five components of every network
- **Neurons** — units that sum their inputs and apply an activation function.
- **Connections** — links that carry each neuron's output to the next layer.
- **Weights and biases** — the learnable numbers: how strong each connection is.
- **Propagation** — how values flow forward, layer by layer, to the output.
- **Learning rule** — how the weights change to reduce the error: **gradient descent**.
Only **weights and biases are learned** (parameters). The architecture, the activation and the learning rate are **design choices** (hyperparameters) that we pick.
## One neuron: a weighted sum, then a function
@diagram cv-neuron
= z = w1·x1 + w2·x2 + w3·x3 + b,  a = g(z)
- **Linear step** — multiply, sum, add the bias: exactly one row of the linear classifier. The **bias shifts the threshold**.
- **Activation g** — ReLU, sigmoid or tanh bends the result. **Without g a neuron is just a linear classifier.**
Worked example with new numbers: x = [2, −1, 3], w = [0.5, 1, −1], b = 1.
= z = 0.5·2 + 1·(−1) + (−1)·3 + 1 = 1 − 1 − 3 + 1 = −2
= ReLU: a = max(0, −2) = 0
= sigmoid: a = 1 / (1 + e^2) ≈ 0.119
## Neurons organised in layers
- **Input layer** — one unit per feature, e.g. the **3072 pixel values** of a 32×32×3 image.
- **Hidden layers** — transform the inputs into useful features.
- **Output layer** — class scores or a regression value.
When every node connects to every node of the next layer, it is a **fully connected (dense) layer**. We count only layers **with weights**, so input → hidden → output is a **2-layer network**.
## A two-layer network on CIFAR-10
= f(x) = W2 · max(0, W1·x + b1) + b2
= shapes: x 3072, W1 100×3072, b1 100, W2 10×100, b2 10
= parameters = 3072·100 + 100 + 100·10 + 10 = 307 200 + 100 + 1 000 + 10 = 308 310
The first layer learns **100 templates**; the second layer **mixes** them, e.g. horse = 0.7 · left-facing + 0.6 · right-facing. So one class can have **several modes** — the key upgrade over Lecture 3.
= 784 → 128 → 10 (MNIST-sized): 784·128 + 128 + 128·10 + 10 = 100 352 + 128 + 1 280 + 10 = 101 770
## Why the non-linearity is essential
Remove max(0, ·) and the two layers collapse into one:
= W2(W1·x) = (W2·W1)x = W′x
- A product of matrices is one matrix: a 3×4 matrix times a 4×5 matrix is one 3×5 matrix.
- So **any stack of linear layers is still one linear classifier**: a 100-layer network without activations still draws straight boundaries and still cannot solve XOR. Biases do not help — the result stays W′x + b′.
- Depth adds power **only when an activation function sits between the layers**. That is why the activation is not optional.
## Activation functions
| Function | Formula | Range | Pros and cons |
|---|---|---|---|
| Sigmoid | 1 / (1 + e^−z) | (0, 1) | saturates, not zero-centred |
| tanh | tanh(z) | (−1, 1) | zero-centred, still saturates |
| ReLU | max(0, z) | [0, ∞) | default choice, cheap; units can die |
| Leaky ReLU | max(0.01z, z) | all real numbers | a small slope below zero fixes dead units |
| GELU | z · Φ(z) | about (−0.17, ∞) | standard in Transformers |
- **Saturation** — at the flat ends of sigmoid and tanh the slope is almost zero, so almost no gradient flows back and learning stalls (part 2 shows why).
- **ReLU** has slope exactly **1** for positive inputs, which is why deep networks train well with it; a unit that only ever gets negative inputs outputs 0 forever — a **dead unit**.
- Rule of thumb for this course: **ReLU in hidden layers**, **sigmoid only at the output of a binary task**.
## Forward pass: is this email spam?
Email “Get free gift cards now!”: free = 1, win = 0, offer = 1, so x = [1, 0, 1]. All biases are 0 to keep the arithmetic simple.
| Unit | Weighted sum | Activation | Output |
|---|---|---|---|
| H1 | 1·0.5 + 0·(−0.2) + 1·0.3 = 0.8 | ReLU | 0.8 |
| H2 | 1·0.4 + 0·0.1 + 1·(−0.5) = −0.1 | ReLU | 0 |
| Out | 0.8·0.7 + 0·0.2 = 0.56 | sigmoid | 0.636 |
= p = σ(0.56) = 1 / (1 + e^−0.56) ≈ 0.636 > 0.5 → spam
H2 outputs **0** because ReLU clips negative values. Keep these numbers: part 3 trains this network with backpropagation.
## Learning paradigms
| Paradigm | Where the signal comes from | In this course |
|---|---|---|
| Supervised | labelled pairs (x, y): the error against the true label | most of CV: classification, detection |
| Unsupervised | no labels: find clusters or compressed representations | later: autoencoders, self-supervised learning |
| Reinforcement | an agent acts and gets rewards or penalties | robotics, games; outside this course |
## Types of neural networks
| Architecture | Suited to | Main idea |
|---|---|---|
| Feedforward / MLP | fixed-size vectors | data flows one way, no cycles (this lecture) |
| CNN | images, video, grids | filters slide over the image (next lecture) |
| RNN, LSTM, GRU | sequences | a hidden state carries memory across time |
| Transformer | tokens, image patches | attention links every patch to every other: ViT, DETR, SAM |
| Autoencoder | compression | compress to a small code (bottleneck), then rebuild |
| GAN | generation | generator vs discriminator, trained together |
| Siamese | comparing two inputs | face verification, self-supervised learning |
Rarely used today but met in surveys and exams: **RBFN** (radial basis units), **SOM** (an unsupervised map that keeps neighbourhoods), **DBN** (stacked layers of the 2006–2012 pre-training era), **CapsNet** (capsules for part–whole relations), **SNN** (spiking neurons, closest to biology). Modern vision is built from **CNNs and Transformers**.
## Strengths and limitations
| Strengths | Limitations |
|---|---|
| learn non-linear patterns | expensive to train |
| extract features automatically | hard to interpret: a black box |
| parallel computation on GPUs | can overfit the training data |
| generalise to unseen data | need large, well-labelled datasets |
@diagram cv-overfitting
**Overfitting** = high training accuracy but low test accuracy, e.g. 95% vs 62%. Usual fixes: more data or augmentation, regularization (L2 weight decay, dropout), a simpler model, early stopping. The lecture's practical tip (CS231n): a **large network with stronger regularization** usually beats a small one, which is harder to optimise.
> A neuron is g(w·x + b); without a non-linear g any stack of layers collapses into one linear classifier, so the activation is what makes depth useful.
## Check yourself
?? Why can a single linear classifier not separate every dataset, and how does a two-layer network fix this?
?= Wx + b gives each class one straight boundary (a hyperplane), so data like XOR or concentric rings cannot be split; a hidden layer with a non-linear activation such as ReLU learns several templates and curved boundaries.
?? A student removes all ReLUs from a 5-layer network to make it faster. What happens to what it can learn?
?= Without activations W5·…·W1·x collapses into one matrix W′x (plus one bias), so the network becomes a single linear classifier and can no longer learn non-linear boundaries.

# Computational graphs, the chain rule and gate patterns

## How a network learns: the training loop
| Step | What happens |
|---|---|
| 1. Forward | inputs flow through the layers to a prediction |
| 2. Loss | measure the error: MSE or cross-entropy |
| 3. Backward | the chain rule gives ∂L/∂w for every weight |
| 4. Update | step against the gradient |
| 5. Repeat | many epochs until the loss is low |
= w ← w − η · ∂L/∂w
- **η (eta)** is the **learning rate**, a hyperparameter we choose.
- The minus sign means we step **against** the gradient: if ∂L/∂w > 0, a bigger w raises the loss, so w goes down; if ∂L/∂w < 0, w goes up.
= w = 0.5, ∂L/∂w = 2, η = 0.1 → w = 0.5 − 0.1·2 = 0.3
Step 3, the backward pass, is **backpropagation** — the topic of this part.
## The problem: 308 310 weights, one loss
To update every weight we need ∂L/∂w for each one of them. Three ways to get it:
| Way | Cost | Verdict |
|---|---|---|
| By hand | pages of algebra, redone for every new architecture | infeasible |
| Numerically | two forward passes per weight: 2 × 308 310 ≈ 616 000 per step | far too slow |
| Backpropagation | one forward and one backward pass for all weights | about 2–3× a forward pass |
Backprop is cheap because it **reuses the intermediate results** of the forward pass instead of rerunning the network for every weight.
## Computational graph
A **computational graph** breaks the computation into **simple nodes** (+, ×, max, exp …). In the **forward pass** values flow **left → right**; in the **backward pass** gradients flow **right → left**, from the loss back to the inputs.
## The chain rule at one node
For a node z = f(x) somewhere inside the graph:
= ∂L/∂x = ∂z/∂x · ∂L/∂z
= downstream = local × upstream
- **Upstream gradient ∂L/∂z** — arrives from the loss side.
- **Local gradient ∂z/∂x** — the node's own derivative; it depends only on the node's inputs.
- **Downstream gradient ∂L/∂x** — what the node sends further back.
A node **never needs to know the rest of the network**: it multiplies what arrives from above by its own local derivative. This single rule is the whole algorithm. The backward pass starts with **∂L/∂L = 1** at the output.
## Worked example: f = (x + y) · z
Inputs x = −2, y = 5, z = −4. Name the middle value q = x + y.
= forward: q = x + y = −2 + 5 = 3
= forward: f = q · z = 3 · (−4) = −12
= backward: ∂f/∂f = 1
= backward: ∂f/∂z = q = 3
= backward: ∂f/∂q = z = −4
= backward: ∂f/∂x = ∂q/∂x · ∂f/∂q = 1 · (−4) = −4
= backward: ∂f/∂y = ∂q/∂y · ∂f/∂q = 1 · (−4) = −4
| Variable | Forward | Local gradient | Upstream | Gradient of f |
|---|---|---|---|---|
| f | −12 | — | — | 1 |
| z | −4 | ∂f/∂z = q = 3 | 1 | 3 |
| q | 3 | ∂f/∂q = z = −4 | 1 | −4 |
| x | −2 | ∂q/∂x = 1 | −4 | −4 |
| y | 5 | ∂q/∂y = 1 | −4 | −4 |
Numerical check: increase x by 0.01 → q = 3.01 → f = 3.01 · (−4) = −12.04. The change −0.04 = −4 × 0.01 ✔, so the gradient is real.
## Gate patterns: how gradients move
@diagram cv-backprop-gates
| Gate | Nickname | Backward rule |
|---|---|---|
| add | distributor | passes the upstream gradient unchanged to every input |
| multiply | swapper | gradient to one input = upstream × the other input |
| max | router | all of the gradient goes to the larger input, zero to the rest |
| copy (one value feeds several branches) | adder | the gradients of all branches are summed |
In the worked example the **+ node distributed** −4 to both x and y, and the **× node swapped**: z got q = 3, q got z = −4.
Practice with new numbers (upstream gradient 2 for the first three gates):
= add: f = x + y → ∂f/∂x = 2, ∂f/∂y = 2
= multiply: f = x · y, x = 3, y = −5 → ∂f/∂x = 2 · (−5) = −10, ∂f/∂y = 2 · 3 = 6
= max: f = max(x, y), x = 4, y = 1 → ∂f/∂x = 2, ∂f/∂y = 0
= copy: x feeds two branches with gradients 3 and −1 → ∂L/∂x = 3 + (−1) = 2
**ReLU = max(0, z)** is a router: it passes the gradient where z > 0 and blocks it (gives 0) where z < 0.
## A sigmoid node and saturation
A sigmoid can be one node because its local gradient has a neat form:
= σ′(z) = σ(z) · (1 − σ(z))
= z = 0: σ = 0.5 → σ′ = 0.5 · 0.5 = 0.25 (the largest value)
= σ = 0.99 → σ′ = 0.99 · 0.01 ≈ 0.01
At σ = 0.99 the downstream gradient is about **100 times smaller** than the upstream one: that is **saturation**. Stack many saturated sigmoids and almost nothing reaches the first layers — the reason **ReLU**, with slope 1 for positive inputs, is the default hidden activation.
> Backprop is one rule applied node by node, downstream = local × upstream: add distributes, multiply swaps, max routes, copy adds.
## Check yourself
?? For f = (x + y) · z with x = 1, y = 3, z = −2, compute f and ∂f/∂x, ∂f/∂y, ∂f/∂z. Show the steps.
?= Forward: q = x + y = 4, f = q · z = −8. Backward: ∂f/∂z = q = 4, ∂f/∂q = z = −2, and the add gate passes −2 unchanged, so ∂f/∂x = ∂f/∂y = −2.
?? Why is backpropagation used instead of numerical gradients to train a network with 308 310 weights?
?= Numerical gradients need two forward passes per weight, about 616 000 per update, while backprop gets every ∂L/∂w from one forward and one backward pass (about 2–3× a forward pass) by applying the chain rule and reusing intermediate values.

# Backprop in practice: the spam network, shapes and debugging

## Backward pass on the spam network (y = 1)
Recall the forward pass: x = [1, 0, 1], hidden pre-activations [0.8, −0.1], ReLU outputs h = [0.8, 0], output weights [0.7, 0.2], z = 0.56, p = σ(z) = 0.636. The email really is spam, so the label is **y = 1**; the loss is **binary cross-entropy (BCE)**.
= L = −[y·ln(p) + (1 − y)·ln(1 − p)] = −ln(0.636) ≈ 0.452
= ∂L/∂z = p − y = 0.636 − 1 = −0.364
**Sigmoid + BCE** give the neat output gradient **p − y** (prediction minus label). From there every step is a gate pattern from part 2:
| Step | Computation | Result |
|---|---|---|
| Loss (BCE) | L = −ln(0.636) | 0.452 |
| Output grad | ∂L/∂z = p − y | −0.364 |
| Output weights | −0.364 × [0.8, 0] | [−0.291, 0] |
| Hidden outputs | −0.364 × [0.7, 0.2] | [−0.255, −0.073] |
| Through ReLU | H2 input was −0.1 → gradient blocked | [−0.255, 0] |
| W1, row H1 | −0.255 × [1, 0, 1] | [−0.255, 0, −0.255] |
| Update, η = 0.1 | 0.7 − 0.1 × (−0.291) | 0.729 |
Three patterns at once:
- **multiply swaps** — an output weight's gradient is −0.364 × its hidden output; a hidden output's gradient is −0.364 × its weight;
- **ReLU routes** — H2's input was −0.1 < 0, so its gradient is blocked and **row H2 of W1 gets no update**;
- the W1 weight for **win = 0** gets **no update**: its gradient is upstream × input = −0.255 × 0 = 0.
The updates with η = 0.1 (biases stay 0 in this example):
= w_out1: 0.7 − 0.1 · (−0.291) = 0.729
= w_out2: 0.2 − 0.1 · 0 = 0.2
= W1 row H1: [0.5, −0.2, 0.3] − 0.1 · [−0.255, 0, −0.255] = [0.5255, −0.2, 0.3255]
Rerun the forward pass: H1 = 0.5255 + 0.3255 = 0.851, z = 0.851 · 0.729 ≈ 0.620, p = σ(0.620) ≈ 0.650 > 0.636. The network is now **more confident** that this email is spam, and the loss went down.
If the label were **y = 0** (not spam), the same formula gives ∂L/∂z = 0.636 − 0 = +0.636, and every update would go the other way.
## Vectors and matrices: backprop through y = Wx
= ∂L/∂W = (∂L/∂y) · xᵀ
= ∂L/∂x = Wᵀ · (∂L/∂y)
**Shape rule: a gradient has the same shape as its variable.** For the last layer of the CIFAR network:
| Quantity | Shape |
|---|---|
| W | 10×3072 |
| x and ∂L/∂x | 3072×1 |
| y = Wx and ∂L/∂y | 10×1 |
| ∂L/∂W = (∂L/∂y) · xᵀ | (10×1)·(1×3072) = 10×3072, matches W |
| ∂L/∂x = Wᵀ · (∂L/∂y) | (3072×10)·(10×1) = 3072×1, matches x |
The full **Jacobian** ∂y/∂W would have 10 × 30 720 = 307 200 entries, almost all zero, so it is **never built**. Forgot a formula? **Arrange the transposes until the shapes match.**
## Modular layers: forward and backward
Every layer — Linear, ReLU, loss — follows the same API. The multiply gate as a layer:
= class Multiply:
=     def forward(self, x, y):
=         self.x, self.y = x, y   # cache
=         return x * y
=     def backward(self, dout):
=         dx = dout * self.y      # swap
=         dy = dout * self.x
=         return dx, dy
- **forward()** computes the output and **caches** what backward will need.
- **backward(dout)** takes the upstream gradient and returns **local × upstream** for each input.
- **Autograd** — PyTorch records this graph during the forward pass and calls every backward **in reverse order**.
## The same network in PyTorch
= model = nn.Sequential(nn.Flatten(), nn.Linear(3*32*32, 100), nn.ReLU(), nn.Linear(100, 10))
= loss_fn = nn.CrossEntropyLoss()
= opt = torch.optim.SGD(model.parameters(), lr=1e-2)
= loss = loss_fn(model(x), y)   # forward
= opt.zero_grad()               # reset old gradients
= loss.backward()               # backprop: every dL/dw
= opt.step()                    # update: w = w - lr * dL/dw
The model is exactly f = W2 · max(0, W1x + b1) + b2: **loss.backward()** is all of backpropagation in one line, and **opt.step()** is the update w ← w − η · ∂L/∂w.
## Gradient check
= ∂f/∂w ≈ [f(w + h) − f(w − h)] / (2h)
= relative error = |a − n| / max(|a|, |n|)
| Gradient | Speed and safety | Use it for |
|---|---|---|
| Numerical | slow, but easy to get right | the reference when checking |
| Analytic (backprop) | fast and exact, but easy to break | training |
- Use **h ≈ 1e-5** and the **centred** difference: it is more accurate than the one-sided [f(w + h) − f(w)] / h.
- Relative error **below 1e-7** → the backward is correct; **about 1e-4** is acceptable with ReLU kinks; **1e-2** → a bug.
- Check a few random weights **before** training.
Worked check on f(w) = w² at w = 3 with h = 0.01:
= [f(3.01) − f(2.99)] / 0.02 = (9.0601 − 8.9401) / 0.02 = 0.12 / 0.02 = 6
= analytic: f′(w) = 2w = 6 → relative error 0
## Four common mistakes
| Mistake | What goes wrong | Fix |
|---|---|---|
| Overwriting at branches | the gradient of one branch replaces the other | add them: use +=, not = |
| Forgetting the cache | backward needs the inputs saved during forward | store x (and y) in forward() |
| Wrong ReLU mask | gradient leaks where the input was negative | pass the gradient only where input > 0 |
| No zero_grad() | PyTorch accumulates gradients across steps | call opt.zero_grad() every step |
PyTorch accumulating gradients is exactly the **copy → adder** rule — that is why zero_grad() is needed every step.
> In practice: each gradient = local × upstream, each gradient has its variable's shape, and a numerical gradient check proves the backward is right.
## Check yourself
?? In the spam network (y = 1, p = 0.636, h = [0.8, 0]) compute ∂L/∂z and the gradients of both output weights. Why does the second one not change?
?= ∂L/∂z = p − y = −0.364; output-weight gradients = −0.364 × [0.8, 0] = [−0.291, 0]. The second weight's input h2 is 0 (ReLU clipped H2's −0.1), and the multiply gate gives upstream × other input = 0.
?? In y = Wx, W is 10×3072 and x is 3072×1. What are the shapes of ∂L/∂W and ∂L/∂x, and how do you get them?
?= ∂L/∂W = (∂L/∂y)·xᵀ is 10×3072 and ∂L/∂x = Wᵀ·(∂L/∂y) is 3072×1: each gradient has the shape of its variable, so arrange the transposes until the shapes match.

# Convolution: filters, output size, stride, padding and parameters

## Recap: a linear classifier on raw pixels
A CIFAR-10 image is **32×32×3**. The linear classifier **flattens** it into a vector **x** of **3 072** numbers and computes **f(x, W) = Wx + b**, giving **10 scores**, one per class.
= x: 32 · 32 · 3 = 3072
= W: 10 × 3072   b: 10   s = Wx + b: 10 scores
- It learns **one template per class**, and its decision boundaries are **linear**.
- In the course notebook it reaches only **≈ 25 %** on CIFAR-10: better than **10 %** random guessing, but far from useful.
## Why flattening is a problem
- **Spatial neighbourhood is thrown away**: pixels (i, j) and (i, j + 1) become two unrelated inputs.
- **A shifted object looks like a completely different vector**: move a cat by a few pixels and almost every input number changes.
- **Fully connected layers do not scale** with image size: every hidden unit has one weight per input number.
| Input | Hidden units | Weights in the first layer |
|---|---|---|
| 32×32×3 (CIFAR) | 1 000 | 3 072 000 |
| 224×224×3 (ImageNet) | 1 000 | 150 528 000 |
| 1000×1000×3 (photo) | 1 000 | 3 000 000 000 |
We need a layer that **respects the 2D structure** and uses **few parameters**.
## Three ideas behind CNNs
- **Local connectivity**: each unit looks at a **small patch** (e.g. 3×3), not at the whole image.
- **Weight sharing**: the **same filter** slides over all positions, because a feature useful in one place (an edge) is useful everywhere.
- **Hierarchy**: stacked layers turn **edges → textures → parts → objects**.
Result: **far fewer parameters**, **translation equivariance** (a shifted object gives a shifted feature map) and **features learned from data** instead of designed by hand.
## Convolution: sliding a filter over the image
Put a **3×3 filter (kernel)** on the top-left corner of the input, multiply the 9 overlapping pairs and **sum** them (plus a bias): that is one output number. Then move the filter one pixel to the right and repeat, row by row.
= out[i, j] = Σ_u Σ_v K[u, v] · in[i + u, j + v] + b
- A **5×5 input** and a **3×3 filter** (stride 1, no padding) give a **3×3 output**: the filter fits in 3 positions per row and 3 per column.
- Deep-learning libraries actually compute **cross-correlation** (the filter is not flipped), but everyone calls it convolution.
@diagram cv-convolution
## Worked example: one output value
Patch rows [3, 1, 0], [2, 1, 0], [4, 2, 1]; filter rows [1, 0, −1] three times: a **vertical-edge filter**. Multiply element by element and add:
= row 1: 3·1 + 1·0 + 0·(−1) = 3
= row 2: 2·1 + 1·0 + 0·(−1) = 2
= row 3: 4·1 + 2·0 + 1·(−1) = 3
= out = 3 + 2 + 3 = 8
A **large positive** value means **bright on the left, dark on the right**: there is a vertical edge here. A value near **0** means a flat patch; a **large negative** value means dark on the left, bright on the right. Each filter answers one question: **is my pattern here?**
## Hand-designed vs learned filters
| Filter | Weights | Responds to |
|---|---|---|
| Blur (box) | all nine weights 1/9 | averages the neighbourhood, smooths noise |
| Sobel-x | [−1 0 1; −2 0 2; −1 0 1] | vertical edges (brightness changes along x) |
| Sobel-y | Sobel-x turned by 90° | horizontal edges (brightness changes along y) |
Before deep learning such filters were **designed by hand**. The CNN idea: **do not design the numbers, learn them by gradient descent**, so the network finds the filters that are best for the task.
## Convolution on a colour image
A filter always **extends through the full depth** of its input. On a **32×32×3** image a ‘5×5 filter’ is really a **5×5×3** block of weights.
= one filter: 5 · 5 · 3 = 75 weights + 1 bias = 76 parameters
= 32×32×3 input, one 5×5×3 filter, S = 1, P = 0  →  28×28×1 activation map
- At every position: **one dot product over 75 numbers + bias** gives one number.
- Sliding **one filter** over the whole image gives **one 2D activation map (feature map)**.
## Many filters give an output volume
- **6 filters** of 5×5×3 give 6 maps, stacked into an output volume **28×28×6**.
- **Output depth = number of filters**: a hyperparameter you choose (typically 32, 64, 128, growing with depth).
- The next conv layer takes the 28×28×6 volume as its input, so each of its filters has depth **6** (e.g. 3×3×6).
## Output size: stride and padding
= O = ⌊(W − K + 2P) / S⌋ + 1
**W** = input size, **K** = filter size (often written F), **P** = padding, **S** = stride. Height and width are computed separately.
| W | K | S | P | Output O |
|---|---|---|---|---|
| 7 | 3 | 1 | 0 | (7 − 3)/1 + 1 = 5 |
| 7 | 3 | 2 | 0 | (7 − 3)/2 + 1 = 3 |
| 7 | 3 | 3 | 0 | floor((7 − 3)/3) + 1 = 2 |
| 32 | 5 | 1 | 0 | (32 − 5)/1 + 1 = 28 |
| 32 | 5 | 1 | 2 | (32 − 5 + 4)/1 + 1 = 32 |
- **Stride S > 1** skips positions and **downsamples** the map (S = 2 roughly halves it).
- For the standard convolution formula, **round down with floor**. Divisibility by S is not required; an incomplete trailing window is omitted.
- **Zero padding** adds a border of P zeros around the input: a 5×5 input with P = 1 becomes 7×7.
- Without padding the map **shrinks at every layer**, and border pixels are used less often than central ones.
- **Same padding**: P = (K − 1)/2 keeps O = W when S = 1, so **3×3 uses P = 1** and **5×5 uses P = 2**.
## Counting parameters
= conv: C_out · (C_in · K · K + 1)
= FC: inputs · outputs + outputs
The **+1** is the **bias** of each filter. A conv layer's parameter count **does not depend on the image size**, only on K, C_in and C_out.
| Layer | Computation | Parameters |
|---|---|---|
| Conv 5×5, 3 → 10 | 10 · (3·25 + 1) | 760 |
| Conv 3×3, 64 → 128 | 128 · (64·9 + 1) | 73 856 |
| FC 3072 → 10 | 3072·10 + 10 | 30 730 |
| FC 3072 → 1000 | 3072·1000 + 1000 | 3 073 000 |
Worked example from the slides: a **32×32×3** input, **ten 5×5 filters**, **S = 1**, **P = 2**.
= spatial size: (32 − 5 + 2·2) / 1 + 1 = 32
= output: 32 × 32 × 10
= parameters: 10 · (5·5·3 + 1) = 10 · 76 = 760
The 3×3 conv with 64 → 128 channels has about **40× fewer** parameters than one FC layer from a CIFAR image to 1 000 units, and it works at **any resolution**.
> A conv layer slides small shared filters through the full input depth: output size ⌊(W − K + 2P)/S⌋ + 1, output depth = number of filters, parameters = C_out · (C_in · K² + 1).
## Check yourself
?? An input is 64×64×3. A conv layer has 16 filters of size 3×3 with stride 1 and padding 1. Give the output shape and the number of parameters.
?= (64 − 3 + 2·1)/1 + 1 = 64, so the output is 64×64×16; parameters = 16 · (3·3·3 + 1) = 16 · 28 = 448.
?? A student says: ‘A fully connected layer works just as well on images, it only needs more memory.’ Give two reasons why a conv layer is better.
?= Flattening throws away the 2D neighbourhood, so a shifted object becomes a different vector, while a conv layer keeps the spatial structure and just shifts its feature map (translation equivariance). FC weights grow with the image size (3 072 000 for 32×32×3 → 1 000 units), whereas conv parameters depend only on K, C_in and C_out thanks to local connectivity and weight sharing.

# Building a CNN: feature maps, pooling, ReLU, batch norm and training

## Fully connected vs convolutional
| Property | Fully connected | Convolutional |
|---|---|---|
| Connectivity | every input to every unit | a local K×K window |
| Weights | one per connection | shared across positions |
| Params grow with image size | yes | no |
| Spatial structure | lost | preserved |
| Shifted object | a different input | a shifted feature map |
The last row is **translation equivariance**: shift the input, and the feature map shifts the same way.
## What filters are learned?
- The course notebook shows the **sixteen 3×3×3 filters** of the **first layer** of a CNN trained on CIFAR-10. Drawn as tiny colour images they look like **oriented edges and colour contrasts**: nobody programmed them, they emerged from the data because they help classification.
- **Deeper layers** combine these simple patterns into **textures** and then into **object parts**.
- A **feature map** is one channel of a layer's output: **bright = strong filter response**. For a ship image some layer-1 maps (after ReLU) light up on the hull outline, some on the sky–water boundary, some on textures.
![A small photo of a white cargo ship on blue sea under a pale sky on the left; to its right a grid of eight grayscale panels of the same ship, each lighting up a different pattern in white on black: the hull outline, the horizon line between sky and water, the wave texture, the vertical edges of the masts](/events/cv/l5-ship-feature-maps.webp)
## Receptive field
The **receptive field (RF)** of a unit is the region of the **input image** that influences it.
= RF = 1 + L · (K − 1)      (stride 1, L layers of K×K)
= 1 layer of 3×3:  1 + 1 · 2 = 3  →  3×3
= 2 layers of 3×3: 1 + 2 · 2 = 5  →  5×5
= 3 layers of 3×3: 1 + 3 · 2 = 7  →  7×7
- In 1D: a top unit sees 3 units below it, and together they see 5 inputs.
- **Stride and pooling** make the RF grow faster.
- That is why a deep network recognizes **large objects** although every filter is small.
## Max pooling
Split each feature map into **non-overlapping 2×2 blocks** (stride 2) and keep the **maximum** of each block.
= input 4×4, rows: [1 1 2 4]  [5 6 7 8]  [3 2 1 0]  [1 2 3 4]
= top-left:    max(1, 1, 5, 6) = 6     top-right:    max(2, 4, 7, 8) = 8
= bottom-left: max(3, 2, 1, 2) = 3     bottom-right: max(1, 0, 3, 4) = 4
= output 2×2: [6 8]  [3 4]
@diagram cv-pooling
- **No learnable parameters**: pooling is a fixed rule.
- Applied to **each channel independently**, so the depth does not change: 32×32×64 → 16×16×64.
- Gives a **small shift invariance**: moving a feature by one pixel inside the window does not change the maximum.
| Operation | Output | Where used |
|---|---|---|
| Max pool 2×2, S = 2 | H/2 × W/2 | LeNet, AlexNet, VGG |
| Average pool | smoothed H/2 × W/2 | LeNet (subsampling), Inception |
| Global average pool | 1×1×C | GoogLeNet, ResNet (before the classifier) |
| Stride-2 convolution | H/2 × W/2 | ResNet, modern all-conv nets |
**Global average pooling** averages each whole channel into one number: **7×7×512 → 512 numbers**, which removes the huge FC layers. Modern nets often use a **stride-2 convolution** instead of pooling, so that the downsampling is also **learned**.
## Non-linearity: ReLU
= f(x) = max(0, x)
= gradient: 1 if x > 0, else 0
- Without a non-linearity, a stack of convolutions **collapses into one linear operation**.
- ReLU **does not saturate** for x > 0, is very cheap, and trains much faster than sigmoid or tanh (in AlexNet **≈ 6× faster**).
- Drawback: a unit whose input is always negative gets zero gradient and stops learning, a **dead ReLU**. Alternatives: **Leaky ReLU**, **GELU**.
## A typical CNN for classification
Repeat **Conv → ReLU → Pool**: the spatial size goes down, the number of channels goes up. Then flatten and classify.
| Layer | Output shape |
|---|---|
| Input | 32×32×3 |
| Conv (32 filters, same padding) + ReLU | 32×32×32 |
| Max pool 2×2 | 16×16×32 |
| Conv (64 filters, same padding) + ReLU | 16×16×64 |
| Max pool 2×2 | 8×8×64 |
| Flatten | 8 · 8 · 64 = 4096 |
| FC + ReLU | 128 |
| FC + softmax | 10 class probabilities |
The **conv / pool part** is the **feature extractor**; the **FC part** is the **classifier**.
## Batch normalization
= x̂ = (x − μ_B) / √(σ²_B + ε)
= y = γ · x̂ + β
- **μ_B, σ²_B**: mean and variance of **each channel** over the mini-batch (and over all spatial positions).
- **γ, β**: **learnable** scale and shift, so the layer can undo the normalization if that helps.
- Usual placement: **Conv → BN → ReLU**.
- **Training**: statistics of the current batch. **Test**: **running averages** collected during training.
- Effect: stable activations, **larger learning rates**, faster convergence, mild regularization.
Worked example for one channel: μ_B = 4, σ²_B = 4 (ε ≈ 0), γ = 3, β = 1, input x = 8.
= x̂ = (8 − 4) / √4 = 4 / 2 = 2
= y = 3 · 2 + 1 = 7
## Regularization in CNNs
A small dataset and many parameters lead to **overfitting**: high training accuracy, much lower test accuracy.
| Method | What it does | Where |
|---|---|---|
| Weight decay | adds the L2 penalty λ‖W‖² to the loss, keeps weights small | all layers |
| Dropout | zeroes units with probability p, during training only | mostly FC layers |
| Data augmentation | random flips, crops, colour jitter: new valid images for free | training images |
In the course notebook: **random horizontal flips + weight decay**; dropout was not needed for the small networks.
## Training a CNN
The same loop as for the linear classifier:
= mini-batch → CNN → scores → softmax cross-entropy loss L
= backprop: ∂L/∂W for every filter and weight
= update: W ← W − η · ∇W L
- Notebook: **SGD with momentum 0.9** and a **OneCycle** learning-rate schedule (warm-up, then decay).
- The gradients of a convolution are again convolutions (with flipped filters).
- **Monitor training vs test (validation) accuracy** to spot overfitting: a growing gap is the warning sign.
@diagram cv-overfitting
> A CNN repeats Conv → BN → ReLU → Pool to shrink space and grow channels, then classifies with FC + softmax; pooling has no weights, the receptive field grows with depth, and overfitting is fought with augmentation, weight decay and dropout.
## Check yourself
?? A 32×32×64 feature map goes through 2×2 max pooling with stride 2. What is the output shape, how many parameters does the layer have, and why is it used?
?= 16×16×64: height and width halve and the depth stays, because each channel is pooled independently; 0 parameters. It reduces computation, makes the receptive field grow faster and adds a small shift invariance.
?? A CNN reaches 95% training accuracy but 62% test accuracy on a small dataset. Name the problem and two remedies from this lecture.
?= Overfitting: the network memorizes the training images instead of generalizing. Use data augmentation (random flips, crops, colour jitter) and weight decay or dropout in the FC layers, and watch the validation accuracy to stop in time.

# CNN architectures: from LeNet to ResNet and beyond

## A short history of CNN architectures
| Year | Network | Depth | Key idea | ImageNet top-5 error |
|---|---|---|---|---|
| 1998 | LeNet-5 | 5 | conv + pooling, trained by backprop | (MNIST digits) |
| 2012 | AlexNet | 8 | ReLU, dropout, GPUs | ≈ 16 % |
| 2014 | VGG-16 | 16 | stacked 3×3 convolutions | ≈ 7 % |
| 2014 | GoogLeNet | 22 | Inception, 1×1 bottlenecks | ≈ 6.7 % |
| 2015 | ResNet-152 | 152 | residual connections | ≈ 3.6 % (ensemble) |
The trend: **deeper networks**, fewer parameters per unit of accuracy and **better training tricks**. (The error numbers are approximate, from the original papers.)
## LeNet-5 (LeCun et al., 1998)
Designed for **handwritten digits**; the input is a **32×32×1 grayscale** image.
= 32×32×1 → C1 conv 5×5: 6@28×28 → S2 pool: 6@14×14
= → C3 conv 5×5: 16@10×10 → S4 pool: 16@5×5 → F5 120 → F6 84 → 10
- Check with the formula: C1 (32 − 5)/1 + 1 = 28; C3 (14 − 5)/1 + 1 = 10.
- About **60 000 parameters**. The pattern **conv → pool → conv → pool → FC** is still the template of many networks.
## AlexNet (Krizhevsky et al., 2012)
= 227×227×3 → Conv1 11×11 + pool: 96@27×27 → Conv2 5×5 + pool: 256@13×13
= → Conv3 3×3: 384@13×13 → Conv4 3×3: 384@13×13 → Conv5 3×3 + pool: 256@6×6 → FC 4096 → FC 4096 → FC 1000
- Won ImageNet 2012 and **started the deep-learning revolution** in computer vision.
- About **60 million parameters**, **most of them in the FC layers**.
- Key ingredients: **ReLU, dropout, data augmentation, training on 2 GPUs**, plus local response normalization.
## VGG (Simonyan & Zisserman, 2014)
Only **3×3 convolutions** and **2×2 max pooling**. After every pooling the spatial size **halves** and the number of channels **doubles**.
= 224 → 112 → 56 → 28 → 14 → 7      channels 64 → 128 → 256 → 512 → 512
- **VGG-16**: 16 weight layers, **≈ 138 million parameters**, mostly in the FC layers (7 · 7 · 512 = 25 088 inputs into FC 4096).
## Why stacks of 3×3 convolutions?
| Property | One 7×7 conv | Three 3×3 convs |
|---|---|---|
| Receptive field | 7×7 | 7×7 |
| Parameters (C channels in and out) | 49 C² | 27 C² |
| Non-linearities | 1 | 3 |
= 3 · (3 · 3 · C · C) = 27 C²    vs    7 · 7 · C · C = 49 C²
= (49 − 27) / 49 ≈ 0.45  →  about 45 % fewer parameters
Design rule: **use small filters and go deeper**: the same receptive field, fewer weights and more non-linearity.
## GoogLeNet and the Inception module
- Instead of choosing one filter size, the module runs **in parallel**: a 1×1 conv; 1×1 → 3×3; 1×1 → 5×5; 3×3 max pool → 1×1. The outputs are **concatenated along the channel dimension**.
- **Global average pooling** replaces the big FC layers; **auxiliary classifiers** help during training.
- Only **≈ 7 million parameters** with 22 layers: far fewer than AlexNet (≈ 60 M) or VGG-16 (≈ 138 M).
## The 1×1 convolution as a bottleneck
A **1×1 conv** looks at no neighbours: at every pixel it is a **linear map across the channels**, C_in → C_out. It changes the **depth**, not the height and width.
= direct:      28×28×192 → 5×5 conv, 32 filters → 28×28×32
= cost:        28·28·32 · 5·5·192 ≈ 120 M multiplies
= bottleneck:  28×28×192 → 1×1 conv, 16 → 5×5 conv, 32 → 28×28×32
= cost:        28·28·16·192 + 28·28·32 · 5·5·16 ≈ 2.4 M + 10.0 M = 12.4 M
The same output shape for about **10× less computation**.
## The degradation problem
- Plain deeper networks are **harder to optimize**: a **56-layer** plain network had **higher training error** than a **20-layer** one.
- This is **not overfitting**, because the **training** error itself is higher. It is an **optimization problem**.
- In theory the deeper net could copy the shallow one and make the extra layers the **identity**, but stacked non-linear layers find the identity hard to learn, and gradients vanish.
## ResNet: the residual block (He et al., 2015)
= y = F(x) + x
= F(x) = H(x) − x
@diagram cv-resnet
- x goes through **conv 3×3 → ReLU → conv 3×3** to give F(x); the **skip (identity) connection** adds x back, then a ReLU follows.
- The layers learn only the **residual**: if doing nothing is best, the weights go to **zero** and the block becomes the identity.
- The **gradient flows directly** through the skip path, so 50, 101, 152 and even 1000+ layers can be trained.
- When the shape changes, the skip path uses a **1×1 projection**.
| Model | Block | Layers | Parameters |
|---|---|---|---|
| ResNet-18 | basic (3×3, 3×3) | 18 | ≈ 11.7 M |
| ResNet-34 | basic | 34 | ≈ 21.8 M |
| ResNet-50 | bottleneck (1×1, 3×3, 1×1) | 50 | ≈ 25.6 M |
| ResNet-101 | bottleneck | 101 | ≈ 44.5 M |
| ResNet-152 | bottleneck | 152 | ≈ 60.2 M |
The bottleneck block reduces the channels with a 1×1 conv, applies a 3×3 and expands them again with a 1×1: the Inception trick again. ResNet ends with **global average pooling + one FC layer** instead of the huge FC head of AlexNet / VGG.
## Efficient networks and beyond CNNs
- **DenseNet (2017)**: each layer receives the **concatenation of all earlier feature maps** (feature reuse).
- **MobileNet (2017)**: **depthwise separable convolution**, a 3×3 filter per channel + a 1×1 conv that mixes the channels; **≈ 8–9× cheaper** than a standard 3×3.
- **EfficientNet (2019)**: **compound scaling** of depth, width and resolution with one coefficient.
- **Vision Transformer (ViT)**: splits the image into **16×16 patches**, linear embedding + position encoding, a transformer encoder with **self-attention**; strong with **large pretraining**.
- **ConvNeXt (2022)**: a ResNet modernized step by step (7×7 depthwise kernels, LayerNorm, GELU); it matches transformers at similar cost and is **still a pure CNN**.
The convolutional prior (**locality, weight sharing**) is still valuable, especially when data is **limited**.
## The CIFAR-10 experiment from the course notebook
A subset of CIFAR-10 (6 000 training and 1 500 test images), the same optimizer and number of epochs for every model, a few epochs on a CPU: the absolute numbers are lower than in papers.
| Model | Parameters | Test accuracy |
|---|---|---|
| Linear | 30 730 | ≈ 25 % |
| LeNet-style | 62 006 | 51.0 % |
| SimpleCNN | 25 578 | 59.3 % |
| VGGMini | 307 946 | 70.1 % |
| ResNetMini | 308 650 | 63.7 % |
- Convolution beats the linear classifier by a wide margin **with fewer parameters**: SimpleCNN has 25 578 vs 30 730.
- SimpleCNN has the fewest parameters yet beats LeNet: **design matters, not only size**.
- VGGMini beats ResNetMini (same depth and width) by about 6 points. No contradiction: skip connections solve the **degradation problem of very deep nets**, and at 8 layers there is nothing to solve.
## Practical recipe
- Start from a network **pretrained on ImageNet** and **fine-tune** it.
- **Small dataset**: **freeze the backbone** and train only the new classifier. **Larger dataset**: fine-tune all layers with a **small learning rate**.
- Use **data augmentation** and **batch normalization** by default.
| Constraint | Reasonable choice |
|---|---|
| Accuracy first | ResNet-50/101, ConvNeXt, EfficientNet |
| Mobile / embedded | MobileNet, EfficientNet-B0 |
| Simple baseline | ResNet-18 |
![A hand holding a smartphone above a green plant leaf with small brown spots in a sunny garden; the phone screen shows the live camera view of the same leaf framed by a thin green square, with no text on the screen](/events/cv/l5-phone-leaf-classifier.webp)
> Architectures moved to deeper nets with smarter building blocks: VGG (small 3×3 filters), GoogLeNet (1×1 bottlenecks), ResNet (skip connections y = F(x) + x against the degradation problem); in practice, fine-tune a pretrained network.
## Check yourself
?? Compare one 7×7 convolution with three stacked 3×3 convolutions (C channels in and out): receptive field, parameters, non-linearities. Which would you choose and why?
?= Both see a 7×7 region, but three 3×3 layers use 3 · 9C² = 27C² weights instead of 49C² (about 45 % fewer) and have three ReLUs instead of one, so the stack is cheaper and more expressive: the VGG rule ‘small filters, go deeper’.
?? A 56-layer plain CNN has higher training error than a 20-layer one. A student says it is overfitting. Is the student right, and what does ResNet change?
?= No: overfitting means low training error and high test error, but here the training error itself is higher, so it is an optimization (degradation) problem. ResNet adds skip connections y = F(x) + x, so the layers learn only the residual, the identity is easy (F = 0), and gradients flow directly through the skip path.

# Lecture 6 — Training neural networks

## Diagnose the training loop
A training step performs a forward pass, computes a loss, backpropagates derivatives and updates parameters. Training loss diagnoses fitting; validation data guide model choices; held-out test data estimate final performance. Fit preprocessing only on training data. Leakage can produce convincing scores that will not survive deployment.

## Activations and initialization
Sigmoid and tanh can saturate, reducing gradient flow. ReLU avoids saturation on its positive side, but inactive units may receive zero gradients. Initialization should preserve useful signal scales across layers: Xavier is associated with balanced variance for approximately symmetric activations; Kaiming accounts for rectified activations. Identical weights cannot break symmetry between otherwise identical units.

## Regularization
L2 weight decay discourages large weights. Dropout randomly suppresses activations during training and changes behaviour at inference. Data augmentation creates plausible training variations; it must preserve the label. Batch normalization normalizes intermediate activations and maintains statistics used during evaluation. Remember the difference between training and evaluation modes.

## Optimizers and learning rate
SGD updates parameters opposite the gradient. Momentum accumulates a direction; AdaGrad and RMSprop adapt scaling; Adam combines moment estimates with adaptive updates. A learning rate that is too high can destabilize training, while a very small rate can make progress slow. Compare training and validation curves before adding complexity. Learning-rate schedules change the step size over training.

## A practical debugging order
Verify labels and preprocessing, inspect shapes, check the loss at initialization, and try to overfit a tiny training subset. Then tune the learning rate and regularization using validation data. Numerical gradient checking compares analytic derivatives with small finite differences; use it on a small differentiable example rather than an entire production training run.

## Transfer learning
A pretrained feature extractor can be frozen while a new head is trained. Fine-tuning unfreezes selected layers, usually with a more cautious learning rate. The useful strategy depends on dataset size and similarity to pretraining. Pretraining does not eliminate the need for a clean evaluation split.

# Lecture 7 — RNNs, attention and transformers

## Recurrent state
An RNN updates a hidden state from the current input and the preceding state. Parameter sharing makes it suitable for sequences of varying length. Backpropagation through time unrolls those updates, which can produce vanishing or exploding gradients. LSTMs introduce a cell state and gates; GRUs use a simpler gated structure. Bidirectional models use information from both directions and cannot be used unchanged for strictly causal generation.

## From a bottleneck to attention
A basic sequence-to-sequence model compresses its input into a representation. Attention lets a prediction use a weighted combination of relevant input states. Self-attention builds queries, keys and values from the same sequence. Its scaled dot-product form is Attention(Q,K,V) = softmax(QKᵀ / √d_k)V. Softmax runs across the keys for each query; the result weights value vectors.

## What each component contributes
Multiple heads learn different projections. Positional information supplies order that bare self-attention does not encode. A causal mask blocks information from future positions. Transformer blocks combine attention, feed-forward layers, residual connections and normalization. Do not confuse a mask that controls access with an attention score that measures relevance within allowed positions.

## Vision transformers
A ViT divides an image into patches, embeds them into tokens and adds positional information. Standard full attention compares pairs of tokens, giving quadratic attention interactions in sequence length. Smaller patches can greatly increase that cost. CNNs build in local structure and shared spatial filters; transformers can connect distant tokens directly but need an appropriate training recipe and data.

## Compare architectures by the task
RNNs update state sequentially; CNNs aggregate local patterns; transformers exchange information through attention. The lecture also connects these ideas to captioning and image–text learning. Model size alone is not an explanation of success: discuss data, pretraining, computational cost and evaluation.

## Revision task
Explain the dimensions of Q, K and V for a small token sequence, then describe what a causal mask changes. No memorized exam answer is needed: trace the computation.

# Lecture 8 — Detection and segmentation

## Four different outputs
Classification predicts an image label. Detection predicts object classes and bounding boxes. Semantic segmentation assigns a class to each pixel without separating same-class objects. Instance segmentation separates individual objects; panoptic segmentation combines object instances with background or material regions. Select metrics that match the output.

## Boxes, IoU and NMS
Intersection over Union is overlap area divided by union area. It measures geometric agreement, not classifier confidence. Non-maximum suppression sorts detections by score, keeps a strong candidate and removes competing overlapping boxes according to its rule and threshold. Excessive suppression can remove nearby distinct objects. Evaluation also depends on matching rules, IoU thresholds, precision and recall; AP summarizes a precision–recall relationship rather than one accuracy number.

## The R-CNN progression
R-CNN classifies proposed regions using convolutional features. Fast R-CNN shares feature computation over the image and extracts region features. Faster R-CNN learns proposals with a Region Proposal Network. The distinction is what computation is shared and where proposals come from. A proposal is not yet the final classified, refined detection.

## Dense prediction
Fully convolutional networks produce spatial predictions. Downsampling loses resolution, so segmentation needs upsampling. Interpolation uses a fixed rule; transposed convolution learns parameters. Transposed convolution is not generally the inverse of an earlier convolution. Skip connections can combine coarse semantic information with finer spatial detail.

## Instance and richer prediction
Mask R-CNN adds a mask branch to region-based detection. Its masks belong to individual detections. Panoptic approaches combine recognition of countable objects with semantic regions. The lecture extends this idea to keypoints, captions and shape prediction: identify the target representation before describing the architecture.

## Revision task
For an image containing two people against a road, describe the different outputs of detection, semantic segmentation and instance segmentation. Then explain which error a high classification score can still hide.

# Lecture 9 — Reinforcement learning

## Learning through interaction
An agent observes a state, selects an action, receives a reward and moves to another state. The aim is expected cumulative return, not merely the next reward. Compared with supervised learning, feedback may be delayed and the agent's choices affect the data it subsequently observes.

## The MDP description
A Markov Decision Process specifies states, actions, transition behaviour, rewards and a discount factor. The Markov assumption says the present state contains the information needed to model the next transition. A policy maps states to actions or action probabilities. Exploration gathers information; exploitation uses the current estimate of what works.

## Values and Bellman reasoning
Vπ(s) is expected return starting in a state under policy π. Qπ(s,a) additionally fixes the first action. Bellman reasoning relates a present value to immediate reward plus discounted future value. In a sampled Q-learning update, a typical target is r + γ max_a′ Q(s′,a′), with terminal transitions handled separately. The discount factor changes how future rewards contribute; a Q-value is not a probability.

## Deep Q-learning
A neural network approximates action values when a table is impractical. The lecture's Atari example connects visual observations to action selection. Training on correlated transitions and a changing prediction target creates stability challenges; distinguish the environment reward from the optimization loss.

## Policy gradients and model-based methods
Policy gradients optimize a parameterized policy directly; REINFORCE uses sampled returns to adjust action probabilities. Value-based and policy-based methods answer related questions through different parameterizations. Model-based methods additionally use or learn transition dynamics for planning. An environment model is different from a value function.

## Revision task
Describe a small environment in terms of state, action, reward and termination. Explain one case where an immediate reward conflicts with the long-term objective, and how an evaluation would reveal it.

# Lecture 10 — Generative models

## What distribution is learned?
A discriminative model predicts a target from an input, such as p(y|x). A generative model describes or samples a data distribution, possibly conditioned on labels or another input. Unsupervised representation learning and realistic sample generation are related aims, but not identical evaluation tasks.

## Autoregressive generation
The chain rule factors a joint distribution into ordered conditional distributions. PixelRNN and PixelCNN apply this principle to images. A causal dependency structure prevents access to pixels that should not yet be known. Sequential sampling can be slow even when some training computation is parallelized.

## Autoencoders and VAEs
A standard autoencoder learns an encoder and decoder to reconstruct inputs through a representation. Sampling arbitrary points from its latent space need not produce plausible outputs. A VAE models a distribution over latent variables and trains a reconstruction term together with a regularizing KL term. Reparameterization permits gradient-based optimization through sampled latent variables. In a common loss convention, reconstruction loss plus KL is minimized; the equivalent evidence lower bound is maximized.

## GANs
A generator produces samples and a discriminator learns to distinguish generated from training examples. Their objectives interact, so apparently improving one loss does not by itself establish overall progress. Training instability and mode collapse are central concerns. Conditional generation adds information such as a class label. Image-to-image translation changes an input representation while retaining task-relevant structure.

## Paired and unpaired translation
Pix2Pix learns from paired examples. CycleGAN uses unpaired domains with a cycle-consistency constraint. Cycle consistency is a useful constraint, not a guarantee of a correct or truthful transformation. For any generated output, evaluate diversity, quality and relevance to the intended task rather than selecting only the nicest examples.

## Revision task
Compare an autoregressive model, a VAE and a GAN by training objective, sampling process and one limitation. Separate what the architecture optimizes from what a user actually needs.