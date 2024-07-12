import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import { Colors } from '../themes/Colors'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';




export default function Cart({ data, product, setProduct, getDataFromDB, getTotal }) {
    const navigation = useNavigation();

    //gönderilen idli elemanı async soragdan sildik
    const removeItemFromCart = async id => {
        // console.warn('basıldı')
        let itemsArray = await AsyncStorage.getItem('cartItems');
        // console.log(ItemsArray) //sitrig olarak geliyor biz göremeyiz jsonparse çevirelim
        itemsArray = JSON.parse(itemsArray);

        //bu itemların id ile benim dışarıdan gönderdiğim itemların idsı eşit değilse bunu çıkar ve yeni bir diziye aktar
        if (itemsArray) {
            let array = itemsArray.filter(item => item !== id)
            //console.log(array)
            await AsyncStorage.setItem('cartItems', JSON.stringify(array));
            getDataFromDB();
        }
    }


    //gönderilen typea göre ve gönderilen idli ürrünün miktarını artıtma ve azaltma
    const updateQuantity = (id, type) => {
        //product.map(item => console.warn(item))
        let updateProducts = product.map(item => {
            if (item.id === id) {
                let newQuantity =
                    //gönderilen type increase ise arttırma işlemi gerçekleştir değilse azaltma işlemi gerçekleştir.
                    type === 'increase' ? item.quantity + 1 : item.quantity - 1;

                //güncellenmiş miktar sıfırdan büyük ise güncellenmiş miktarı ata değilse 1 olarak kalsın
                item.quantity = newQuantity > 0 ? newQuantity : removeItemFromCart(id);
            }
            return item
        })
        setProduct(updateProducts)
        getTotal(updateProducts)
    };


    return (
        //productID yi product kartta tanımlamıştık
        <TouchableOpacity onPress={() => navigation.navigate('ProductInfo', { productID: data.id })} style={{
            width: '100%',
            height: 100,
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 6,
        }}>
            <View style={styles.imageContainer}>
                <Image style={styles.image} source={data.productImage} />
            </View>

            <View style={styles.productDetail}>
                <View>
                    <Text>{data.productName}</Text>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        opacity: 0.6,
                        marginTop: 4,
                    }}>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '400',
                            marginRight: 4,
                            maxWidth: '85%',
                        }}>{data.productPrice * data.quantity}₺</Text>
                        <Text style={{
                            fontSize: 12
                        }}>
                            {data.productPrice * data.quantity + (data.productPrice * data.quantity) / 20} ₺ eski fiyat
                        </Text>
                    </View>
                </View>

                <View style={styles.buttonGroup}>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 20,
                    }} >
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => updateQuantity(data.id, 'decrease')}>

                            <MaterialCommunityIcons name='minus' size={16} />
                        </TouchableOpacity>
                        <Text>{data.quantity}</Text>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => updateQuantity(data.id, 'increase')}>
                            <MaterialCommunityIcons name='plus' size={16} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => removeItemFromCart(data.id)}>
                        <MaterialCommunityIcons name='delete-outline' size={16} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    imageContainer: {
        width: '30%',
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.backgroundLight,
        marginRight: 20,
        borderRadius: 10,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',

    },
    productDetail: {
        flex: 1,
        height: '100%',
        justifyContent: 'space-around'
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    button: {
        backgroundColor: Colors.backgroundLight,
        padding: 4,
        borderRadius: 100,
        borderWidth: 0.4,
        opacity: 0.5
    },
    deleteButton: {
        backgroundColor: Colors.backgroundMedium,
        color: Colors.backgroundLight,
        padding: 8,
        borderRadius: 100,
        borderWidth: 0.4,
        opacity: 0.5
    }
})