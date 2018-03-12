import React from 'react';
import { StyleSheet, Text, View, Button, Alert, TextInput, FlatList } from 'react-native';
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
      <View style={styles.container}>
        <View style={{flex: 20,alignItems: 'center',justifyContent: 'flex-end'}}>         
          <TextInput placeholder='Product' style={{ marginTop: 5, marginBottom: 5,  fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
      onChangeText={(name) => this.setState({name})} value={this.state.name}/>
          <TextInput placeholder='Amount'  style={{ marginTop: 5, marginBottom: 5,  fontSize:18, width: 200, borderColor: 'gray', borderWidth: 1}}
              onChangeText={(amount) => this.setState({amount})}
              value={this.state.amount}/>      
        </View>  
        <View style={{flex: 20}}>
            <Button onPress={this.buttonAdd} title="Save" style={styles.buttonstyle}/>  
          </View>   
          <View style={{flex: 60}}>
            <Text style={styles.text_shop}>Shopping List</Text> 
                 <FlatList 
                  style={{marginLeft : "0%"}}
                  keyExtractor={item => item.id} 
                  renderItem={({item}) => 
                    <View style={{flexDirection: 'row'}}>
                      <View>
                        <Text style={{fontSize: 18}}>{item.name}, {item.amount}</Text>
                      </View>
                      <View>
                        <Text style={{fontSize: 18, color: '#0000ff'}} onPress={() => this.deleteItem(item.id)}> bought</Text>
                      </View>
                    </View>} data={this.state.data} ItemSeparatorComponent={this.listSeparator} 
                />     
          </View>      
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
  text_shop: {
    fontSize: 18,
    color: 'blue'
  },
  buttonstyle:{
    fontSize: 36,
    backgroundColor: 'red',
    color: '#fff'
  }
});
