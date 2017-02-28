import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator
} from 'react-native';

export default class login extends Component {
  constructor() {
    super();
    this.state = {
      customer: null,
      animating: false
    }
    this.fetchAPI = this.fetchAPI.bind(this);
  }

  fetchAPI() {
    this.setState({'fetchClicked': 'clicked'});
    var headers = new Headers();

    headers.set('Authorization', 'Basic Y2JkY2ZhNDMtZGQ2Ny00YzM4LWI0MTgtODM1NzJhOTM2ZmNhOjdlZDUwOTcxLWNiOGQtNGViZi1iZWUwLTQ5MTM1NDRjZjg5NA==');
    headers.set('Content-Type', 'application/x-www-form-urlencoded');

    var body = 'username=fitbit@bgdigitaltest.co.uk&password=password12&grant_type=password';

    this.setState({animating: true});

    fetch('https://treatsmaproxy.herokuapp.com/login', {
      method: 'POST',
      headers: headers,
      body: body
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(err);
        }
        response.json().then((response) => {
          let headers = new Headers();
          headers.set('Authorization', `Bearer ${response.access_token}`);
          headers.set('X-Client-ID', 'cbdcfa43-dd67-4c38-b418-83572a936fca');
          headers.set('Accept', 'application/vnd.api+json, application/json');

          fetch('https://treatsmaproxy.herokuapp.com/v1/customers', {
            headers
          })
          .then((response) => {
            return response.json();
          })
          .then((response) => {
            this.setState({'customer': response.data[0]});
            this.setState({animating: false});
          })
        });
      })
      .catch((err) => {
        console.log('error');
      });
  }

  renderCustomerDetails() {
    if (this.state.customer) {
      return (
        <Text style={styles.instructions}>
           Hello {this.state.customer.attributes.title} {this.state.customer.attributes.surname}
        </Text>
      )
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          onPress={this.fetchAPI}
          title="Login"
          color="#841584"
          accessibilityLabel="Login"/>
        <ActivityIndicator
          animating={this.state.animating}
          style={[styles.centering, {height: 80}]}
          size="large"
         />
        {this.renderCustomerDetails()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('login', () => login);
