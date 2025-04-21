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

export const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate=useNavigate()
  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setisEducator] = useState(true);
  const [enrolledCourses, setenrolledCourses] = useState([]);

  const calculateRating = (course) => {
    if (!course.courseRatings || course.courseRatings.length === 0) {
      return 0;
    }
    
    let totalRating = 0;
    course.courseRatings.forEach(rating => {
      totalRating += rating.rating;
    });
  
    return totalRating / course.courseRatings.length;
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
    setenrolledCourses(dummyCourses)
  
  }

  // Fetch all courses
  useEffect(() => {
    console.log("useEffect ran");
    setAllCourses(dummyCourses);
    fetchUserEnrolledCourses()
  }, []);

  const value = { currency, allCourses,navigate,calculateRating,isEducator,setisEducator,calculateChapterTime,
    calculateCourseDuration,calculateNoOfLectures,enrolledCourses,setenrolledCourses,fetchUserEnrolledCourses
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export default AppContextProvider; // ✅ Fix default export


