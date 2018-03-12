import React from 'react';
import { StyleSheet, Text, View, Alert, TextInput, FlatList } from 'react-native';
import { Header, Button, Card, FormInput, List, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';

import Expo, { SQLite } from 'expo';

const db = SQLite.openDatabase('coursedb.db');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name:'', 
      amount:'',
      data:[],

    }
  } 
  componentDidMount() {
    // Create course table
    db.transaction(tx => {
      tx.executeSql('create table if not exists item (id integer primary key not null, amount int, name text);');
    });
    this.updateList();
  }
  // Add List
  buttonAdd = () => {
    db.transaction(tx => {
      tx.executeSql('insert into item ( amount,name) values (?,?)', [this.state.amount, this.state.name]);    
    }, null, this.updateList)
 
  }  

  // Update List
  updateList = () => {
    db.transaction(tx => {
      tx.executeSql('select * from item', [], (_, { rows }) =>
        this.setState({data: rows._array})
      ); 
    });
  }

  // Delete List
  deleteItem = (id) => {
    db.transaction(
      tx => {
        tx.executeSql(`delete from item where id = ?;`, [id]);
      }, null, this.updateList
    )    
  }
  
  listSeparator = () => {
    return (
      <View
        style={{
          backgroundColor: '#000',
          flexDirection: 'row'
        }}
      />
    );
  }; 
 
  render() {
    
    return (
      <View>
          <Header   
            centerComponent={{ text: 'SHOPPING LIST', style: { color: '#fff' } }}   
          />
          <Text style={styles.titleText}>Product</Text>
          <FormInput placeholder='Product' style={{ marginTop: 5, marginBottom: 5,  fontSize:18, width: 200,      borderColor: 'gray', borderWidth: 1}}
          onChangeText={(name) => this.setState({name})} value={this.state.name}/>
          <Text style={styles.titleText}>Amount</Text>
          <FormInput placeholder='Amount'  style={{ marginTop: 5, marginBottom: 5,  fontSize:18, width: 200,      borderColor: 'gray', borderWidth: 1}}
              onChangeText={(amount) => this.setState({amount})}
              value={this.state.amount}/>      
              <Button onPress={this.buttonAdd} title="Save" style={styles.buttonstyle}/>  
            <List>
                 <FlatList 
                  keyExtractor={item => item.id} 
                  renderItem={({item}) => 
                    <ListItem
                      title={item.name}
                      onPress={() => this.deleteItem(item.id)}
                      rightTitle={'bought'}
                      subtitle={
                        <View style={styles.subtitleView}>                    
                          <Text style={styles.ratingText}>{item.amount}</Text>
                        </View>
                        }
                      />
                  
                    } data={this.state.data}  
                />   
            </List>      
      </View>
       
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    paddingLeft: 10,
  },
  subtitleView: {
    paddingTop: 5
  },
  titleText:{
    paddingLeft:20,
    paddingTop:10
  },
  buttonstyle:{
    paddingTop:10
  }
});
