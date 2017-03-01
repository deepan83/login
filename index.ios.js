import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator
} from 'react-native';
var CookieManager = require('react-native-cookies');


export default class login extends Component {
  constructor() {
    super();
    this.state = {
      customer: null,
      jsessionid: null,
      access_token: null,
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
        return response.json();
      })
      .then((response) => {
        var headers = new Headers();

        CookieManager.get('https://treatsmaproxy.herokuapp.com/', (err, res) => {
          this.setState({jsessionid: res.JSESSIONID});
        });

        headers.set('Authorization', 'Basic Y2JkY2ZhNDMtZGQ2Ny00YzM4LWI0MTgtODM1NzJhOTM2ZmNhOjdlZDUwOTcxLWNiOGQtNGViZi1iZWUwLTQ5MTM1NDRjZjg5NA==');
        headers.set('Content-Type', 'application/x-www-form-urlencoded');

        var body = 'username=fitbit@bgdigitaltest.co.uk&password=password12&grant_type=password';

        return fetch('https://treatsmaproxy.herokuapp.com/token', {
          method: 'POST',
          headers: headers,
          body: body
        })
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(err);
        }
        return response.json();
      })
      .then((response) => {
        let headers = new Headers();

        this.setState({access_token: response.access_token});

        headers.set('Authorization', `Bearer ${response.access_token}`);
        headers.set('X-Client-ID', 'cbdcfa43-dd67-4c38-b418-83572a936fca');
        headers.set('Accept', 'application/vnd.api+json, application/json');

        return fetch('https://treatsmaproxy.herokuapp.com/v1/customers', {
          headers
        });
      })
      .then((response) => {
        if (!response.ok) {
          throw new Error(err);
        }
        return response.json();
      })
      .then((response) => {
        this.setState({'customer': response.data[0]});
        this.setState({animating: false});
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
        <Text style={styles.instructions}>
         JSESSIONID: {this.state.jsessionid}
        </Text>
        <Text style={styles.instructions}>
         access_token: {this.state.access_token}
        </Text>
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
