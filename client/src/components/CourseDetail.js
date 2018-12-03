import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';

import axios from 'axios';
import ReactMarkdown from 'react-markdown';

class CourseDetail extends Component {
  constructor(){
    super();
    this.state={
      course:{},
      author:{}
    }
  }

  //uses the id prop that is passed to the route to get the assosiated course
  componentDidMount(){
    axios.get(`http://localhost:5000/api/courses/${this.props.id}`)
      .then(response => {
        this.setState({
          course: response.data,
          author: response.data.user
        })
      })
      .catch(err => {
        //sends any error to the not found route
        this.props.history.push('/notfound')
      });
  }

  render(){
    return (
      <div>
        <div className="actions--bar">
          <div className="bounds">
            <div className="grid-100">
              <span>
                {
                  (this.props.user.id === this.state.author._id) &&
                  <>
                    <Link className="button" to={`/courses/${this.props.id}/update`}>Update Course</Link>
                    <Link className="button" to="/">Delete Course</Link>
                  </>
                }
                </span>
                <Link className="button button-secondary" to="/">Return to List</Link></div>
          </div>
        </div>
        <div className="bounds course--detail">
          <div className="grid-66">
            <div className="course--header">
              <h4 className="course--label">Course</h4>
              <h3 className="course--title">{this.state.course.title}</h3>
              <p>By {this.state.author.firstName} {this.state.author.lastName}</p>
            </div>
            <div className="course--description">
              <ReactMarkdown source={this.state.course.description} />
            </div>
          </div>
          <div className="grid-25 grid-right">
            <div className="course--stats">
              <ul className="course--stats--list">
                {
                  (this.state.course.estimatedTime) &&
                  <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <h3>{this.state.course.estimatedTime}</h3>
                  </li>
                }
                {this.state.course.materialsNeeded &&
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <ReactMarkdown source={this.state.course.materialsNeeded} />
                  </li>
                }
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(CourseDetail);
