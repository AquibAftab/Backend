import  { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req, res) => {
    // get user detail from frontend


    //validation
    // check if user already exist
    // check for images, check for avatar
    // upload them to cloudinary
    // create user object- create entry in db
    // remove password and refresh token field from response
    // check from user creation
    // return res

    const { fullName, email, username, password } = req.body;
    console.log("email", email);

    // Validation: Ensure all fields are filled
    if ([fullName, email, username, password].some((field) => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    // Check if user already exists
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    });
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    // Check for avatar and cover image
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;

    // Upload images to Cloudinary if provided
    const avatar = avatarLocalPath ? await uploadOnCloudinary(avatarLocalPath) : null;
    const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

    if (!avatar) {
        throw new ApiError(400, "Avatar file is required");
    }

    // Create the user
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password, // Fixed typo
        username: username.toLowerCase()
    });

    // Fetch the created user without password and refresh token
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    // Send response
    return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
});

export { registerUser };