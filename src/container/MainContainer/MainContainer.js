import React, {Component} from 'react';
import './MainContainer.css';
import axios from 'axios';
import { Icon, Input, Modal, Header, Button, Form } from 'semantic-ui-react';

class MainContainer extends Component {
  state={
    score: 0,
    modalOpen: false,
    isloading: false
  }

  handleOpen = () => this.setState({ modalOpen: true })

  handleClose = () => this.setState({ modalOpen: false })

  handleChange = (e) =>{
    this.setState({
        [e.target.name] : e.target.value
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    axios.get(`http://localhost:3600/query/${this.state.address}`)
    .then(response => {
      this.setState({
        score: response.data.queryPoint,
        isloading: true
      })
      console.log(this.state.address)
    }).catch(err => console.log(err))
  }

  handlePostSubmit = (e) => {
    e.preventDefault();
    console.log(1)
    const postData={
      queryAddress: this.state.address,
      queryComment: this.state.options,
      queryContributor: this.state.contributor
    }
    axios.post(`http://localhost:3600/query`, postData)
    .then(response => {
      this.setState({
        isloading: true,
      })
      this.handleClose()
      console.log(this.state)
    }).catch(err => console.log(err))
  }

    render() {
      return (
        <div className='MainContainer'>
          <div className='inputWrapper'>
            <div className='slugan' as='h1'>Your address safe?</div>
            <br/>
            <Form onSubmit={this.handleSubmit}>
              <Input name='address' value={this.address} onChange={this.handleChange} fluid size='big' icon={<Icon color='teal' name='search' inverted circular link />} placeholder='Check your address!' />
            </Form>
            <br/>
            <div className='score'>{this.state.score}</div>
            <br/>
            <Modal
              trigger={<Button onClick={this.handleOpen} fluid inverted>report address</Button>} 
              open={this.state.modalOpen}
              onClose={this.handleClose}
              basic size='small'>
              <Header as='h1' icon='bullhorn' content='Report address'/>
              <Modal.Content>
                <Form>
                  <Input fluid name='address' value={this.address} onChange={this.handleChange} icon='btc' iconPosition='left' placeholder='Address'/><p/>
                  <Input fluid name='contributor' value={this.contributor} onChange={this.handleChange} icon='user' iconPosition='left' placeholder='Contributor'/><p/>
                  <Input fluid name='options' value={this.options} icon='question circle' iconPosition='left' placeholder='Reason'/><p/>
                </Form>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={this.handlePostSubmit} color='teal'>
                  Send
                </Button>
              </Modal.Actions>
            </Modal>
          </div>
        </div>
      );
    }
  }
  
  export default MainContainer;