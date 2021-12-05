const express = require("express");
const router = express.Router();

const LetterModel = require("../../models/letters/Letters");

// @route  GET /letter
// @desc   Get all letters
// @access Public
router.get("/", async (req, res) => {
  const letters = await LetterModel.find().sort({ date: -1 });
  res.json(letters);
});

// @route  POST /letter/new
// @desc   new letter
// @access Private
router.post("/new", async (req, res) => {
  const reqData = req.body;
  try {
    const newLetter = new LetterModel({
      name: reqData.name,
      email: reqData.email,
      title: reqData.title,
      plainText: reqData.plainText,
      htmlText: reqData.htmlText.replace(/\n/g, ""),
      stateFlag: reqData.stateFlag,
    });

    const letter = await newLetter.save();
    res.json(letter);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// @route  POST /letter/edit/:id
// @desc   Edit Letter
// @access Private
router.post("/edit/:id", async (req, res) => {
  const reqData = req.body;
  try {
    const letter = await LetterModel.findByIdAndUpdate(
      req.params.id,
      {
        title: reqData.title,
        plainText: reqData.plainText,
        htmlText: reqData.htmlText.replace(/\n/g, ""),
        stateFlag: reqData.stateFlag,
      },
      { new: true }
    );

    await letter.save();
    return res.json(letter);
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

// @route  POST /letter/like/:type/:email/:id
// @desc   Like Letter
// @access Private
router.post("/like/:type/:email/:id", async (req, res) => {
  try {
    const letter = await LetterModel.findById(req.params.id);

    if (
      letter.likes.filter((like) => like.email === req.params.email).length > 0
    ) {
      return res.status(400).json({ error: "You already liked" });
    } else if (
      letter.unlikes.filter((unlike) => unlike.email === req.params.email)
    ) {
      return res.status(400).json({ error: "You already unliked" });
    }

    if (req.params.type === "like") {
      letter.likes.push({ email: req.params.email });
    } else {
      letter.unlikes.push({ email: req.params.email });
    }

    await letter.save();

    return res.json(letter);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

// @route  POST /letter/unlike/:type/:email/:id
// @desc   unLike Letter
// @access Private
router.post("/unlike/:type/:email/:id", async (req, res) => {
  try {
    const letter = await LetterModel.findById(req.params.id);

    if (req.params.type === "like") {
      const removeIndex = letter.likes
        .map((like) => like.email)
        .indexOf(req.params.email);
      letter.likes.splice(removeIndex, 1);
    } else {
      const removeIndex = letter.unlikes
        .map((unlike) => unlike.email)
        .indexOf(req.params.email);
      letter.unlikes.splice(removeIndex, 1);
    }

    await letter.save();

    return res.json(letter);
  } catch (error) {
    return res.status(500).json({ error: "Server error" });
  }
});

// @route  DELETE /letter/:id
// @desc   delete a Letter
// @access Private
router.delete("/:id", async (req, res) => {
  try {
    const letter = await LetterModel.findById(req.params.id);

    if (!letter) {
      return res.status(404).json({ error: "Letter not found." });
    }

    await letter.remove();

    res.json({ success: "Letter removed" });
  } catch (error) {}
});

module.exports = router;
