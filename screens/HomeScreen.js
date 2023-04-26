import { View, Text, StyleSheet, TextInput, Pressable, Image, ScrollView, Alert, ActivityIndicator, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Searchbar } from 'react-native-paper';
import debounce from 'lodash.debounce';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useDetailsContext } from '../providers/DetailsProvider';
// import UserAvatar from 'react-native-user-avatar-component';
import { MaterialIcons } from '@expo/vector-icons';
import * as SQLite from 'expo-sqlite';
import {
  useFonts,
  MarkaziText_400Regular,
  MarkaziText_500Medium,
  MarkaziText_600SemiBold,
  MarkaziText_700Bold,
} from '@expo-google-fonts/markazi-text';
import {
  Karla_200ExtraLight,
  Karla_300Light,
  Karla_400Regular,
  Karla_500Medium,
  Karla_600SemiBold,
  Karla_700Bold,
  Karla_800ExtraBold,
  Karla_200ExtraLight_Italic,
  Karla_300Light_Italic,
  Karla_400Regular_Italic,
  Karla_500Medium_Italic,
  Karla_600SemiBold_Italic,
  Karla_700Bold_Italic,
  Karla_800ExtraBold_Italic,
} from '@expo-google-fonts/karla';


const db = SQLite.openDatabase('little_lemon');


export default function HomeScreen({ navigation }) {
    const { details, setDetails, isOnboardingCompleted, setIsOnboardingCompleted, defaultDetails } = useDetailsContext();
    const sections = ['Starters', 'Mains', 'Desserts'];

    const [isLoading, setIsLoading] = useState(true);
    const [ data, setData] = useState([]);
    const [query, setQuery] = useState('');
    const [searchBarText, setSearchBarText] = useState('');
    const [filterSelections, setFilterSelections] = useState(sections.map(() => false));
    const [supNum, setSupNum] = useState(1);
    
    let [fontsLoaded] = useFonts({
      MarkaziText_400Regular,
      MarkaziText_500Medium,
      MarkaziText_600SemiBold,
      MarkaziText_700Bold,
      Karla_200ExtraLight,
      Karla_300Light,
      Karla_400Regular,
      Karla_500Medium,
      Karla_600SemiBold,
      Karla_700Bold,
      Karla_800ExtraBold,
      Karla_200ExtraLight_Italic,
      Karla_300Light_Italic,
      Karla_400Regular_Italic,
      Karla_500Medium_Italic,
      Karla_600SemiBold_Italic,
      Karla_700Bold_Italic,
      Karla_800ExtraBold_Italic,
    });

    const Item = ({name, price, description, imageSource}) => {
        return(
            <View style = {styles.itemContainer}> 
                <Text style = {styles.itemTitle}>{name}</Text>
                <View style = {styles.itemSubContainer}>
                  <View>
                    <Text style = {styles.itemDescription}>{description}</Text>
                    <Text style = {styles.itemPrice}>{'$'+price}</Text>
                  </View>
                  <Image
                      source={{uri: imageSource}}
                      style = {styles.itemImage} />
                </View>
            </View>
        )
    };
    
    const RenderItem = ({item}) => {
        return (<Item name={item.name} price={item.price} description={item.description} imageSource={`https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/${item.image}?raw=true`} /> )
    };

    const Filters = ({ onChange, selections, sections }) => {
        return (
          <View style={styles.filtersContainer}>
            {sections.map((section, index) => (
              <TouchableOpacity
                onPress={() => {
                  onChange(index);
                }}
                key= {index}
                style={{
                  flex: 1 / sections.length,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 10,
                  paddingHorizontal: 0,
                  backgroundColor: selections[index] ? '#F4CE14' : '#EDEFEE',
                  borderWidth: 1,
                  borderColor: 'white',
                  borderRadius: 16,
                  marginLeft: 10,
                  marginVertical: 10,
                }}>
                <View>
                  <Text style={{ color: selections[index] ? 'black' : 'rgb(73, 94, 87)', 
                        fontFamily: 'Karla_800ExtraBold',
                        fontSize: 16 }}>
                    {section}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        );
    };

    function useUpdateEffect(effect, dependencies = []) {
        const isInitialMount = useRef(true);
        useEffect(() => {
          if (isInitialMount.current) {
            isInitialMount.current = false;
          } else {
            return effect();
          }
        }, dependencies);
    }

    useUpdateEffect(() => {
        (async () => {
          const activeCategories = sections.filter((s, i) => {
            // If all filters are deselected, all categories are active
            if (filterSelections.every((item) => item === false)) {
              return true;
            }
            return filterSelections[i];
          });
          try {
            const menuItems = await filterByQueryAndCategories(
              query,
              activeCategories
            );
            setData(menuItems);
            setSupNum(value => value + 1);
          } catch (e) {
            Alert.alert(e.message);
          }
        })();
    }, [filterSelections, query]);

    async function filterByQueryAndCategories(query, activeCategories) {
        
        return new Promise((resolve) => {
          db.transaction((tx) => {
            tx.executeSql(`SELECT * from little_lemon where category in (${'?,'.repeat(activeCategories.length).slice(0,-1)}) and name like '%${query}%';`, 
              activeCategories,
              (_, { rows }) => {
                resolve(rows._array);
              },
              () => {
                console.log('Filtering query failed ');
            },
            
            );
          })
          //resolve(SECTION_LIST_MOCK_DATA);
        });
    }

    const lookup = useCallback((q) => {
        setQuery(q);
      }, []);
    
    const debouncedLookup = useMemo(() => debounce(lookup, 500), [lookup]);

    const handleSearchChange = (text) => {
        setSearchBarText(text);
        debouncedLookup(text);
    };

    const handleFiltersChange = async (index) => {
        const arrayCopy = [...filterSelections];
        arrayCopy[index] = !filterSelections[index];
        setFilterSelections(arrayCopy);
    };

    const updateDatabaseMenu = async() => {
        try {
            const response = await fetch('https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json');
            const json = await response.json();
            setData(json.menu);
            for(let food of json.menu){
                db.transaction((tx) => {
                    tx.executeSql("insert into little_lemon(name, price, description, image, category) values (?,?,?,?,?)",[food.name,food.price,food.description,food.image,food.category],
                        ()=>{console.log('database update successful')},
                        ()=>{console.log('database update failed')})
                })
            }
        } catch(err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect( () => {
        db.transaction((tx) => {
            // tx.executeSql("drop table little_lemon;");
            tx.executeSql("SELECT * from little_lemon;", [], (_, {rows}) => {
                setData(rows._array);
                setIsLoading(false);
            },
                (transaction, error) => {
                    tx.executeSql('create table if not exists little_lemon (id integer primary key not null, name text, price real, description text, image text, category text);', [], () => {}, (tx, error) => {
                        console.log(error);
                    })
                    updateDatabaseMenu();
                }
            );
        })
    }, [])

    return(
        <SafeAreaView style={styles.container}>
        {(isLoading || !fontsLoaded) ? (
                <ActivityIndicator/>
            ) : (
              <View style={styles.container}>
                    <FlatList
                        data = {data}
                        // keyExtractor={(item, index) =>  item.id+index+item.name} renderItem
                        renderItem  = {RenderItem}
                        ListHeaderComponent={() => {
                          return(
                            <View style={styles.heroContainer}>
                              <Text style={styles.titleText}>Little Lemon</Text>
                              <Text style={styles.subTitleText}>Chicago</Text>
                              <View style={styles.heroSubContainer}>
                                <Text style={styles.descriptionText}>We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.</Text>
                                <Image
                                    source={require('../images/HeroImage.png')}
                                    style={styles.heroImage}/>
                              </View>
                              <Searchbar
                                    placeholder="Search"
                                    placeholderTextColor="black"
                                    onChangeText={handleSearchChange}
                                    value={searchBarText}
                                    style={styles.searchBar}
                                    iconColor="white"
                                    inputStyle={{ color: 'black' }}
                                    // elevation={0}
                                    icon={({ size, color }) => (
                                      <MaterialIcons name="search" size={24} color />
                                    )}/>
                              <View style={styles.categoryListContainer}>
                                <Text style={styles.categoryListContainerText}>ORDER FOR DELIVERY!</Text>
                                <Filters
                                    selections={filterSelections}
                                    onChange={handleFiltersChange}
                                    sections={sections}/>
                              </View>
                            </View>)
                        }}>
                    </FlatList>
              </View>
            )}
        </SafeAreaView>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    innerContainer: {
        flex: 1,
    },
    imagestyle: {
        height: 150,
        width: 150,
        resizeMode: 'cover',
    },
    heroContainer: {
      // flex: 1,
      backgroundColor: '#495E57',
    },
    heroSubContainer: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    titleText: {
      fontFamily: 'MarkaziText_500Medium',
      fontSize: 64,
      color: '#F4CE14',
      paddingHorizontal: 10,
      marginTop: 10,
    },
    subTitleText: {
      fontFamily: 'MarkaziText_400Regular',
      fontSize: 40,
      color: '#EDEFEE',
      paddingHorizontal: 10,
    },
    descriptionText: {
      fontFamily: 'Karla_500Medium',
      fontSize: 17,
      paddingVertical: 20,
      paddingLeft: 10,
      color: '#EDEFEE',
      width: 200,
    },
    heroImage: {
      height: 150,
      width: 150,
      resizeMode: 'cover',
      borderRadius: 16,
    },
    searchBar: {
        marginBottom: 15,
        backgroundColor: '#fff',
        shadowRadius: 0,
        shadowOpacity: 0,
        borderRadius: 20,
        marginHorizontal: 10,
        borderWidth: 2,
    },
    categoryListContainer: {
      backgroundColor: '#fff',
    },
    categoryListContainerText:{
      fontFamily: 'Karla_800ExtraBold',
      fontSize: 20,
      color: 'black',
      paddingHorizontal: 10,
      paddingVertical: 15,
    },
    filtersContainer: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 16,
        marginBottom: 10,
        borderBottomColor: '#bbb',
        borderBottomWidth: 1,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    itemContainer: {
      flex: 1,
      borderBottomColor: '#bbb',
      borderBottomWidth: 1,
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    itemTitle: {
      fontFamily: 'Karla_700Bold',
      fontSize: 18,
      color: '#000',
      paddingHorizontal: 10,
      marginTop: 20,
    },
    itemSubContainer: {
      flexDirection: 'row',
      marginBottom: 10,
    },
    itemDescription: {
      fontFamily: 'Karla_400Regular',
      fontSize: 16,
      paddingTop: 20,
      paddingLeft: 10,
      color: '#000',
      width: 250,
    },
    itemImage: {
      height: 100,
      width: 100,
      resizeMode: 'cover',
      borderRadius: 16,
    },
    itemPrice: {
      fontFamily: 'Karla_500Medium',
      fontSize: 16,
      color: '#000',
      paddingHorizontal: 10,
      marginTop: 10,
      marginBottom: 20,
    }
})