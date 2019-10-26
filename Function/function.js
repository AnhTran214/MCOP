import AsyncStorage from '@react-native-community/async-storage';
import firebase from 'react-native-firebase';

// Gửi dữ liệu dạng Chuỗi
export const setItemToAsyncStorage1 = async (item, value) => {
    const currentScreen = await AsyncStorage.setItem(item, value);
};
// item là tên của cái biến muốn gửi lên AsyncStorage (Mình phải nhớ tên biến này)
// value là giá trị của cái biến đó

// -----------------------------------------------------------------------------------

// Gửi dữ liệu dạng Chuỗi và dạng JSON
export const setItemToAsyncStorage = async (item, value) => {
    await AsyncStorage.setItem(item, JSON.stringify(value));
};

// -----------------------------------------------------------------------------------

// Lấy dữ liệu từ AsyncStorage
export const getItemFromAsyncStorage = async (item) => {
    var temp, realItem;
    try {
        temp = await AsyncStorage.getItem(item).then((temp) => {
            realItem = temp;
        });
    } catch (error) {
        alert(error);
    }
    return realItem;
};
// item là tên biến mà mình đã đẩy từ hàm setItemFromAsyncStorage
// const bienLuuTru = await getItemFromAsyncStorage('tênBiếnCầnLấy');

// -----------------------------------------------------------------------------------

export const getStatusColor = (status) => {
    if (status === 'Đang chờ xử lý') return 'orange';
    else if (status === 'Đã xử lý') return '#4CC417';
    else return 'red';
};
//neu chuoi nhap vao qua dai thi cat lam 2 va thanh ...

// -----------------------------------------------------------------------------------

export const replaceHalfString = (str) => {
    const position = Math.floor(str.length / 3);
    return str.slice(0, position) + '...';
};

// -----------------------------------------------------------------------------------

export const returnE = (str) => {
    if (str === 'Vi phạm') return 'violation';
    if (str === 'Xử lý') return 'status';
};
