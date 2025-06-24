import { User } from "./model.js";
import TryCatch from "./TryCatch.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
export const registerUser = TryCatch(async (req, res) => {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
        res.status(400).json({
            message: "User Already exists"
        });
        return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({
        name,
        email,
        password: hashedPassword,
    });
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d", });
    res.status(201).json({
        message: "User Registered",
        user,
        token
    });
});
export const loginUser = TryCatch(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        res.status(404).json({
            message: "User not found!"
        });
        return;
    }
    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
        res.status(400).json({
            message: "Invalid Password!"
        });
        return;
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({
        message: "User Logged In",
        user,
        token,
    });
});
export const myProfile = TryCatch(async (req, res) => {
    const user = req.user;
    res.json(user);
});
export const addToPlaylist = TryCatch(async (req, res) => {
    const userId = req.user?._id;
    const user = await User.findById(userId);
    if (!user) {
        res.status(404).json({
            message: "No user with this id",
        });
        return;
    }
    if (user?.playlist.includes(req.params.id)) {
        const index = user.playlist.indexOf(req.params.id);
        user.playlist.splice(index, 1);
        await user.save();
        res.json({
            message: "Removed from playlist",
        });
        return;
    }
    user.playlist.push(req.params.id);
    await user.save();
    res.json({
        message: "Added to Playlist",
    });
});
