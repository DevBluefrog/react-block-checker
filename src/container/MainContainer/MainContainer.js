import React, {Component} from 'react';
import './MainContainer.css';
import axios from 'axios';
import Web3 from 'web3';
import { Icon, Input, Modal, Header, Button, Form } from 'semantic-ui-react';

class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {isConnected: false, peers: 0, version: ''};
    this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
  }

  componentWillMount() {
    if(this.web3 && this.web3.isConnected) {
      this.setState({isConnected: true});
      if(this.web3.net.listening) {
        this.setState({peers: this.web3.net.peerCount});
      }
      this.setState({version: this.web3.version.node})
    }
  }

  componentDidMount(){
    
  }
  state={
    score: 0,
    modalOpen: false,
    isloading: false,
    platform : '0x16618f44e47f646406b6eb129b1b75592b10d3a2',
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
    axios.get(`http://dfc005b3.ngrok.io/query/${this.state.address}`)
    .then(response => {
      this.setState({
        score: response.data.queryPoint,
        contributor: response.data.queryAddress,
        isloading: true
      })
      console.log(this.web3.eth.sendTransaction({to:this.state.contributor, from:'0xfef77732859dad1f92cc3eb397cfacc85c90fc54', value:800000000}))
      console.log(this.web3.eth.sendTransaction({to:this.state.platform, from:'0x0b94ea7e52246c4b22ff3144224f56f80077a70c', value:200000000}))
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