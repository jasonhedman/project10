import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';

import axios from 'axios';

class CreateCourse extends Component{

  constructor() {
    super();
    this.state = {
      invalid: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //how to access the form data
  title = React.createRef();
  description = React.createRef();
  estimatedTime = React.createRef();
  materialsNeeded = React.createRef();

  //called when the form is submitted
  //popuates a data object if the user filled the field out that is then passed in the body of the post requeste
  //redirects the user to the / route after the course is created
  handleSubmit(e){
    e.preventDefault();
    var data = {};
    data.user = this.props.user.id
    console.log(this.description.current.value);
    if(this.title.current.value !== ""){
      data.title = this.title.current.value;
    }
    if(this.description.current.value !== ""){
      data.description = this.description.current.value;
    }
    if(this.estimatedTime.current.value !== ""){
      data.estimatedTime = this.estimatedTime.current.value;
    }
    if(this.materialsNeeded.current.value !== ""){
      data.materialsNeeded = this.materialsNeeded.current.value;
    }
    console.log(data);
    axios.request({
      url: 'http://localhost:5000/api/courses',
      method: 'post',
      headers: {
        'Content-Type': "application/json"
      },
      auth: {
        username: this.props.user.email,
        password: this.props.user.password
      },
      data:JSON.stringify(data)
    })
    .then(() => {
      this.props.history.push('/');
    })
    .catch((err) => {
      this.setState({
        invalid: true
      })
    })
  }




  render(){
    return (
      <div className="bounds course--detail">
        <h1>Create Course</h1>
          <div>
        {
          (this.state.invalid)
          ?<div>
              <h2 className="validation--errors--label">Validation errors</h2>
              <div className="validation-errors">
                <ul>
                  <li>Please provide a value for "Title"</li>
                  <li>Please provide a value for "Description"</li>
                </ul>
              </div>
          </div>
          :<></>
        }
          <form onSubmit={this.handleSubmit}>
            <div className="grid-66">
              <div className="course--header">
                <h4 className="course--label">Course</h4>
                <div><input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..."
                    ref={this.title} /></div>
                <p>By {this.props.user.fullName}</p>
              </div>
              <div className="course--description">
                <div><textarea id="description" name="description" className="" placeholder="Course description..." ref={this.description}></textarea></div>
              </div>
            </div>
            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input"
                        placeholder="Hours" ref={this.estimatedTime} /></div>
                  </li>
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <div><textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." ref={this.materialsNeeded}></textarea></div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid-100 pad-bottom"><button className="button" type="submit">Create Course</button><Link to="/" className="button button-secondary">Cancel</Link></div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(CreateCourse);
