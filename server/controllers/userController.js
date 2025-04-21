import User from "../models/User.js";
import { Purchase } from "../models/Purchase.js";
import Stripe from "stripe";
import Course from "../models/Course.js";


// Get User Data
export const getUserData = async (req, res) => {
    try {
        // Extracting userId from the auth middleware
        const userId = req.auth.userId;  
        console.log("➡️ Clerk userId received:", userId);  // Debugging log

        // Check if userId exists and proceed to find user
        if (!userId) {
            return res.json({ success: false, message: 'User ID is missing in the request' });
        }

        // Find user in database
        const user = await User.findById(userId);

        // If user doesn't exist
        if (!user) {
            return res.json({ success: false, message: 'User Not Found' });
        }

        // Return success response with user data
        return res.json({ success: true, user });
    } catch (error) {
        console.error("Error fetching user data:", error);  // Debugging log for any caught errors
        return res.json({ success: false, message: error.message });
    }
};

// User Enrolled Courses with Lecture Links
export const userEnrolledCourses = async (req, res) => {
    try {
        // Extract userId from auth middleware
        const userId = req.auth.userId;
        console.log("➡️ Enrolled courses request for userId:", userId);  // Debugging log

        // Check if userId exists and fetch courses
        if (!userId) {
            return res.json({ success: false, message: 'User ID is missing in the request' });
        }

        // Find user and populate enrolled courses
        const userData = await User.findById(userId).populate('enrolledCourses');

        // Return success response with enrolled courses data
        return res.json({ success: true, enrolledCourses: userData.enrolledCourses });
    } catch (error) {
        console.error("Error fetching enrolled courses:", error);  // Debugging log
        return res.json({ success: false, message: error.message });
    }
};

//Purchase Course
export const purchaseCourse = async(req,res)=>{
    try {
        const {courseId} = req.body
        const {origin} = req.headers
        const userId = req.auth.userId
        const userData = await User.findById(userId)
        const courseData = await Course.findById(courseId)

        if(!userData||!courseData){
            return res.json({success: false,message: 'Data Not Found'})
        }

        const purchaseData = {
            courseId: courseData._id,
            userId,
            amount: (courseData.coursePrice - courseData.discount*courseData.coursePrice/ 100).toFixed(2),
        }

        const newPurchase = await Purchase.create(purchaseData)

        //Stripe gateway Initialized
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
        const currency = process.env.CURRENCY.toLowerCase()

        //Creating line items to for stripe
        const line_items = [{
            price_data:{
                currency,
                product_data:{
                    name:courseData.courseTitle
                },
                unit_amount: Math.floor(newPurchase.amount)*100
            },
            quantity:1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/loading/my-enrollments`,
            cancel_url: `${origin}/`,
            line_items:line_items,
            mode: 'payment',
            metadata:{
                purchaseId:newPurchase._id.toString()
            }
        })

        res.json({success:true, session_url:session.url})
    } catch (error) {
        res.json({success:false,message:error.message});
    }
}
