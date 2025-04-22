/*import { createContext, useState, useEffect } from "react";
import { dummyCourses } from "../assets/assets";


export const AppContext=createContext()

const AppContextProvider = ({children})=>{

       const currency = import.meta.env.VITE_CURRENCY;

       const [allCourses,setAllCourses]=useState([])

       //fetch all courses
       const fetchAllCourses = async () => {
        setAllCourses(dummyCourses)
      }
      
       useEffect(()=>{
           
  console.log("useEffect ran");
           fetchAllCourses()
       },[])

       const value={
          currency,allCourses

       }
       return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
       )
}

export default AppContextProvider; */
import { createContext, useState, useEffect } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from 'axios';
import { toast } from "react-toastify";


export const AppContext = createContext();

const AppContextProvider = ({children}) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL

  const currency = import.meta.env.VITE_CURRENCY;
  const navigate=useNavigate()
   
  const {getToken} = useAuth()
  const {user} = useUser()


  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setisEducator] = useState(false);
  const [enrolledCourses, setenrolledCourses] = useState([]);
  const [userData, setUserData] = useState(null)

  //Fetch All Courses
  {/*const fetchAllCourses = async ()=>{
        try {
          const {data} = await axios.get(backendUrl + '/api/course/all'); 
          if(data.success){
            setAllCourses(data.courses)
          }else{
            toast.error(data.message)
          }
        } catch (error) {
          toast.error(error.message)
        }
  }*/}
  const fetchAllCourses = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/course/all');
      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  

  //fetch user data
  const fetchUserData = async ()=>{

    if(user.publicMetadata.role === 'educator'){
      setisEducator(true)
    }

    try {
      const token = await getToken();

      const {data} = await axios.get(backendUrl + '/api/user/data', {headers: 
        {Authorization: `Bearer ${token}`}})

        if(data.success){
          setUserData(data.user)
        }else{
          toast.error(data.message)
        }
    } catch (error) {
      toast.error(error.message)
    }
  }

  const calculateRating = (course) => {
    if (!course.courseRatings || course.courseRatings.length === 0) {
      return 0;
    }
    let totalRating = 0;
    course.courseRatings.forEach(rating => {
      totalRating += rating.rating;
    })
    return Math.floor(totalRating / course.courseRatings.length)
  };
  
  //function to calculate course chapter time
  const calculateChapterTime=(chapter)=>{
    let time=0
    chapter.chapterContent.map((lecture)=>time+=lecture.lectureDuration)
    return humanizeDuration(time*60*1000,{units:["h","m"]})
  }

  //function to calculate the courseDuration
  const calculateCourseDuration=(course)=>{
    let time=0

    course.courseContent.map((chapter)=>chapter.chapterContent.map(
      (lecture)=>time+=lecture.lectureDuration))
      return humanizeDuration(time*60*1000,{units:["h","m"]})
  }

  //Function to calculate the total no of lectures in the course
  const calculateNoOfLectures=(course)=>{
     let totalLectures=0;
     course.courseContent.forEach(chapter=>{
      if(Array.isArray(chapter.chapterContent)){
        totalLectures+=chapter.chapterContent.length
      }
     });
     return totalLectures;
  }

  //Fetch user enrolled courses
  const fetchUserEnrolledCourses=async()=>{

    try {
      const token = await getToken();
      const {data} = await axios.get(backendUrl + '/api/user/enrolled-courses',{headers: {Authorization: `Bearer ${token}` }})
      if(data.success){
         setenrolledCourses(data.enrolledCourses.reverse())
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }

  
  }


  // Fetch all courses
  useEffect(() => {
    console.log("useEffect ran");
    fetchAllCourses(); // ✅ Call the actual backend fetch instead of setting dummy data
  }, []);


  useEffect(()=> {
    if(user){
       fetchUserData()
       fetchUserEnrolledCourses()
    }
  },[user])
  

  const value = { currency, allCourses,navigate,calculateRating,isEducator,setisEducator,calculateChapterTime,
    calculateCourseDuration,calculateNoOfLectures,enrolledCourses,setenrolledCourses,fetchUserEnrolledCourses, 
    backendUrl, userData, setUserData, getToken, fetchAllCourses
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider; // ✅ Fix default export


