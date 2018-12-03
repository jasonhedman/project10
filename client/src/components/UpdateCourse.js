import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';

import axios from 'axios';

class UpdateCourse extends Component{

  constructor(){
    super();
    this.state={
      invalid:false,
      course:{},
      author:{},
      title:'',
      description:'',
      estimatedTime:'',
      materialsNeeded:''
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  //gets the requested course and sets the state to its values
  componentDidMount(){
    axios.get(`http://localhost:5000/api/courses/${this.props.match.params.id}`)
    .then(response => {
      if(response.data.user._id !== this.props.user.id){
        return this.props.history.push('/forbidden');
      }
      var estimatedTime = '';
      var materialsNeeded = ''
      if(response.data.estimatedTime){
        estimatedTime = response.data.estimatedTime;
      }
      if(response.data.materialsNeeded ){
        materialsNeeded = response.data.materialsNeeded;
      }
      this.setState({
        course: response.data,
        author: response.data.user,
        title:response.data.title,
        description:response.data.description,
        estimatedTime:estimatedTime,
        materialsNeeded:materialsNeeded
      })
      })
      .catch(err => {
        if(err.response.status >= 500 || err.response.status < 600){
          return this.props.history.push('/error')
        }
        this.props.history.push('/notfound')
      });
  }

  //submits a put request to the database when the form is submitted
  //the data body comes from the component state
  handleSubmit(e){
    e.preventDefault();
    var data = {};
    if(this.state.title !== ""){
      data.title = this.state.title;
    }
    if(this.state.description !== ""){
      data.description = this.state.description;
    }
    if(this.state.estimatedTime !== ""){
      data.estimatedTime = this.state.estimatedTime;
    }
    if(this.state.materialsNeeded !== ""){
      data.materialsNeeded = this.state.materialsNeeded;
    }
    console.log(data);
    axios.request({
      url: ('http://localhost:5000/api/courses/' + this.props.match.params.id),
      method: 'put',
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
      });
      console.log(err)
    })
  }

  handleChange(e){
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  render(){
    return (
      <div className="bounds course--detail">
        <h1>Update Course</h1>
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
                <div><input id="title" name="title" type="text" className="input-title course--title--input"
                    value={this.state.title} onChange={this.handleChange} /></div>
                <p>By {this.state.author.firstName} {this.state.author.lastName}</p>
              </div>
              <div className="course--description">
                <div>
                  <textarea id="description" name="description" className="" value={this.state.description} onChange={this.handleChange} />
                </div>
              </div>
            </div>
            <div className="grid-25 grid-right">
              <div className="course--stats">
                <ul className="course--stats--list">
                  <li className="course--stats--list--item">
                    <h4>Estimated Time</h4>
                    <div><input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input"
                        placeholder="Hours" value={this.state.estimatedTime} onChange={this.handleChange} /></div>
                  </li>
                  <li className="course--stats--list--item">
                    <h4>Materials Needed</h4>
                    <div>
                      <textarea id="materialsNeeded" name="materialsNeeded" className="" placeholder="List materials..." value={this.state.materialsNeeded} onChange={this.handleChange} />
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="grid-100 pad-bottom"><button className="button" type="submit">Update Course</button><Link className="button button-secondary" to='/'>Cancel</Link></div>
          </form>
        </div>
      </div>
    );
  }
}

export default withRouter(UpdateCourse);
