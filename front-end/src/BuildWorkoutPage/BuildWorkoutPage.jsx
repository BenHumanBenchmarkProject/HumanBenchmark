import "./BuildWorkoutPage.css"
import {Link} from "react-router"

const BuildWorkoutPage = () =>{
    return(
        <div>
            <h1>Build Workout</h1>
            <Link to={"/"}><button>Home</button></Link>
        </div>

    )
}

export default BuildWorkoutPage
