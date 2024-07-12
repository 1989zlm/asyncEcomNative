import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList, Image, Dimensions, Animated, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Items } from '../database/Database';
import { Colors } from '../themes/Colors';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage';



//! GÖNDERDİĞİMİZ İD Yİ ALMALIYIZ BUNUDA USEROUTE İLE YAPABİLİRİZ.
export default function ProductInfo() {

    const width = Dimensions.get('window').width;// ürün detayında reimler ekrana tam sığsın diye..

    const scrollX = new Animated.Value(0);

    //product detayında resim kaydırılırken slider ın görüntü ayarları yapıldı
    const position = Animated.divide(scrollX, width);

    const navigation = useNavigation();
    const route = useRoute();
    // console.log(route)
    //!id ile ürünü çağırmak için(bastığımız ürünün id sini useRoute içerisindeki paramstan aldık)
    const { productID } = route.params;
    //console.log(productID);

    const [product, setProduct] = useState([]);

    //asyncstorage dan verileri sil
    const clearAsyncStorage = async () => {
        try {
            await AsyncStorage.clear();
        } catch (error) {
            console.log(error)

        }
    }

    useEffect(() => {
        getDataFromDB();
        // clearAsyncStorage();
    }, [navigation])

    //clearAsyncStorage();


    //console.log(product);
    const getDataFromDB = () => {
        //idsini bilidğimiz ürünü find methodu ile product statetine aktardık
        //? 1.YOOL FOR LA BÜTÜN DİZİYİ DÖNÜYORUZ VE İD LER EŞİTSE BU VERİYİ VER DEDİK 
        // for (let index = 0; index < Items.length; index++) {
        //     // console.log(Items[index]);
        //     //bu itemsın indexli elemanının id si benim product ıd me eşit ise bunu set et
        //     if (Items[index].id == productID) {
        //         console.warn(Items[index])
        //     }
        // }
        //? 2. YOL
        const product = Items.find(item => item.id === productID)
        //console.warn(product)
        //product varsa bu set producta set et
        if (product) {
            setProduct(product);
            return;
        }
    };

    const addToCart = async id => {
        //  console.warn(id)
        //sepette önceden bu veri varsa asyncstorage dan bu veriyi getir.
        let itemArray = await AsyncStorage.getItem('cartItems');
        //console.log(itemArray)

        itemArray = JSON.parse(itemArray);

        if (itemArray) {
            let array = itemArray;
            array.push(id);
            // console.log('çalıştı')
            try {
                await AsyncStorage.setItem('cartItems', JSON.stringify(array));
                navigation.navigate('Home')
            } catch (error) {
                return error;
            }
        } else {
            let array = [];
            array.push(id);
            try {
                await AsyncStorage.setItem('cartItems', JSON.stringify(array));
                //Alert.alert('eklendi');
                //asyncStorage veriyi ekledikten sonra home sayfasına gel
                navigation.navigate('Home')
            } catch (error) {
                console.log(error)
                return error;
            }
        }

    }


    // const renderProduct = item => {
    //     // console.warn(item)
    //     return (

    //     )
    // }

    return (
        <View style={styles.container}>
            <ScrollView>
                <View style={{
                    marginTop: 10,
                }} >
                    <View style={{
                        width: '100%',
                        paddingTop: 16,
                        paddingLeft: 16,
                    }}>
                        <TouchableOpacity onPress={() => navigation.goBack('Home')}>
                            <Entypo
                                name='chevron-left'
                                style={{
                                    fontSize: 18,
                                    color: Colors.backgroundDark,
                                    backgroundColor: Colors.white,
                                    padding: 12,
                                    borderRadius: 10
                                }}
                            />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        horizontal
                        data={product.productImageList ? product.productImageList : null}
                        showsHorizontalScrollIndicator={false}
                        decelerationRate={0.8} //kaydırmanın yavaşlama oranını belirleycek
                        bounces={false} // geri tepme işini daha iyi yapcak
                        snapToInterval={width} //liste ögelerinin hizalanması için aralık ayarlarını belirleyecek
                        // renderItem={({ item }) => console.log(item)}
                        renderItem={({ item }) => (
                            <View
                                style={{
                                    width: width,
                                    height: 240,
                                }}>
                                <Image style={{
                                    width: '100%',
                                    height: '100%',
                                    resizeMode: 'contain'
                                }}
                                    source={item} />
                            </View>
                        )}
                        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: false },
                        )}
                    />
                    <View style={{
                        flexDirection: 'row',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 16,
                        marginTop: 32
                    }}>
                        {product.productImageList ? product.productImageList.map((data, index) => {
                            let opacity = position.interpolate({
                                inputRange: [index - 1, index, index + 1],
                                outputRange: [0.2, 1, 0.2],
                                extrapolate: 'clamp',
                            });
                            return (
                                <Animated.View
                                    key={index}
                                    style={{
                                        width: '16%',
                                        height: 2.4,
                                        backgroundColor: Colors.black,
                                        marginHorizontal: 4,
                                        opacity,
                                    }}></Animated.View>
                            );
                        }) : null}
                    </View>

                    <View style={{ paddingHorizontal: 16, marginTop: 6 }}>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginVertical: 14,
                        }}>
                            <Entypo name='shopping-cart'
                                style={{
                                    fontSize: 18,
                                    color: Colors.blue,
                                    marginRight: 16
                                }}
                            />
                            <Text style={{ color: Colors.black, fontSize: 12 }}>Shopping</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            marginVertical: 4,
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }} >
                            <Text style={{
                                fontSize: 24,
                                fontWeight: '600',
                                letterSpacing: 0.4,
                                color: Colors.black,
                                maxWidth: '84%',
                                marginVertical: 4
                            }}>{product.productName}</Text>
                            <TouchableOpacity style={{
                                backgroundColor: Colors.blue + 20,
                                padding: 8,
                                borderRadius: 100,
                            }}>
                                <Ionicons name='link-outline' size={24} color={Colors.black} />
                            </TouchableOpacity>
                        </View>

                        <Text style={{
                            fontSize: 12,
                            color: Colors.black,
                            fontWeight: '400',
                            maxWidth: '85%',
                            opacity: 0.5,
                            lineHeight: 20,
                            maxHeight: 44,
                            marginBottom: 18
                        }}>{product.description}
                        </Text>

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }} >

                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{
                                    backgroundColor: Colors.backgroundLight,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    padding: 12,
                                    marginRight: 10,
                                    borderRadius: 100,
                                }}>
                                    <Entypo name='location-pin' size={16} color={Colors.blue} />
                                </View>
                                <Text> İstanbul Üsküdar {'\n'} 17-0001</Text>
                            </View>

                            <Entypo name='chevron-right' size={22} color={Colors.backgroundDark} />
                        </View>
                    </View>

                    <View style={{ paddingHorizontal: 16 }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: '500',
                            color: Colors.black,
                            marginVertical: 4,
                        }}>{product.productPrice}.00 ₺</Text>
                        <Text>
                            Tax Rate %2 {product.productPrice / 20}₺ ({''}
                            {product.productPrice + product.productPrice / 20}₺)
                        </Text>
                    </View>

                </View>
            </ScrollView>

            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                bottom: 0,
                width: '100%',
                height: '8%'
            }}>
                <TouchableOpacity
                    //eğer durum avaliable ise addto kart fonksiyonu çalışsın değilse null gelsin
                    onPress={() => (product.isAvailable ? addToCart(product.id) : null)}
                    style={{
                        width: '86%',
                        height: '90%',
                        backgroundColor: Colors.blue,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 20
                    }}>
                    <Text style={{
                        fontSize: 12,
                        fontWeight: '500',
                        color: Colors.white,
                        textTransform: 'uppercase',
                    }}>{product.isAvailable ? 'Add to cart' : 'Not Available'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        width: '100%',
        height: '100%',
        position: 'relative'
    }
})