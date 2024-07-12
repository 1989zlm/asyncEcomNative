import { View, Text, ScrollView, TouchableOpacity, StyleSheet, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import Header from '../componenst/Header';
import { Colors } from '../themes/Colors';
import ProductCard from '../componenst/ProductCard';
import { Items } from '../database/Database';
import SectionHeader from '../componenst/SectionHeader';


export default function Home() {

    const [products, setProducts] = useState([]);
    const [accessory, setAccessory] = useState([]);


    useEffect(() => {
        getDataFromDB();
    }, [])

    //!dataBase de urun aksesuar beraber geliyor onu parçalayıp ayırmamız lazım fordöngüsü ile
    const getDataFromDB = () => {
        let productList = [];
        let accessoryList = [];
        //for index sıfırla başlasın bir bir artsın nereye kadar dababasedeki itemsın uzunluğu kadar
        for (let index = 0; index < Items.length; index++) {
            // console.log(index)
            // databasedeki kategorileri ayır product ise productliste gönder
            if (Items[index].category === 'product') {
                // console.log(Items[index])
                //kategori aksesuar ise accessoryliste gönder.
                productList.push(Items[index])
            } else {
                accessoryList.push(Items[index])
            }
        }
        // console.log(accessoryList)
        setProducts(productList);
        setAccessory(accessoryList);
    }
    // getDataFromDB();

    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={Colors.white} barStyle={'dark-content'} />
            <ScrollView showsVerticalScrollIndicator={false}>
                <Header />
                <View style={{
                    marginBottom: 10,
                    padding: 16
                }}>
                    <Text style={{
                        fontSize: 26,
                        color: Colors.black,
                        fontWeight: '500',
                        letterSpacing: 1,
                        marginBottom: 10,
                    }}>
                        Hi-Fi Shop & Service
                    </Text>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '400',
                        letterSpacing: 1,
                        lineHeight: 24,
                    }}>
                        Audio shop on Rustaveli Ave 57.
                        {'\n'}This shop offers both products and services
                    </Text>
                </View>
                <View style={{ padding: 16 }}>
                    <SectionHeader title={'Product'} count={'41'} />
                    <View style={{
                        flexDirection: 'row',
                        justifyContent: 'space-around',
                        flexWrap: 'wrap'
                    }}>
                        {products.map(data => (<ProductCard key={data.id} data={data} />))}
                    </View>
                </View>
                <View style={{ padding: 16 }}>
                    <SectionHeader title={'Accessories'} count={'78'} />
                    <View style={{
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                    }}>
                        {accessory.map(data => (
                            <ProductCard data={data} key={data.id} />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        width: '100%',
        height: '100%',
    },
    headerContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        padding: 16
    },

});