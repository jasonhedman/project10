import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import axios from 'axios';

class Courses extends Component {
  constructor(){
    super();
    this.state={
      courses:[]
    }
  }

  //gets the list of courses when the app is loaded and the root route is requested
  componentDidMount(){
    axios.get('http://localhost:5000/api/courses')
      .then(response => {
        this.setState({
          courses: response.data
        })
      });
  }

  render(){
    let courses;
    courses = this.state.courses.map((course, i) => {
      return (
        <div className="grid-33" key={i}><Link className="course--module course--link" to={"/courses/"+course._id}>
            <h4 className="course--label">Course</h4>
            <h3 className="course--title">{course.title}</h3>
          </Link>
        </div>
      );
    })

    return (
      <div className="bounds">
        {courses}
        <div className="grid-33"><Link className="course--module course--add--module" to="courses/create">
            <h3 className="course--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                viewBox="0 0 13 13" className="add">
                <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
              </svg>New Course</h3>
          </Link>
        </div>
      </div>
    );
  }
}

export default Courses;
