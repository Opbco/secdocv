import React, { Component, Fragment } from 'react';
import {
  TouchableOpacity,
  Text,
  Linking,
  View,
  Image,
  ImageBackground,
  BackHandler,
  Alert,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import styles from './scanStyle';
import CryptoJS from "react-native-crypto-js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scan: false,
      ScanResult: false,
      result: null,
      verified: false,
    };
  }
  onSuccess = e => {
    const scannedData = e.data.split('@');
    this.setState({
      result: e.data,
      scan: false,
      verified: false,
      ScanResult: true,
    });
    if (scannedData.length !== 2) {
      Alert.alert("Error", "Wrong code in synthax");
    } else {
      let cipherText = scannedData[1];
      try {
        // Decrypt
        let bytes = CryptoJS.AES.decrypt(cipherText, "mynameisowonop");
        let decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        console.log(decryptedData)
        this.setState({
          result: decryptedData,
          scan: false,
          verified: true,
          ScanResult: true,
        });
      } catch (error) {
        Alert.alert("Error", "unable to decrypt the code. May be wrong code");
        this.setState({
          result: null,
          scan: false,
          verified: false,
          ScanResult: true,
        });
      }
    }
  };
  activeQR = () => {
    this.setState({ scan: true });
  };
  scanAgain = () => {
    this.setState({ scan: true, ScanResult: false });
  };
  render() {
    const { scan, ScanResult, result, verified } = this.state;
    console.log(result);
    return (
      <View style={styles.scrollViewStyle}>
        <Fragment>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => BackHandler.exitApp()}>
              <Text>back</Text>
            </TouchableOpacity>
            <Text style={styles.textTitle}>Scan QR Code</Text>
          </View>
          {!scan && !ScanResult && (
            <View style={styles.cardView}>
              <Image
                source={require('./../../assets/images/camera.png')}
                style={{ height: 36, width: 36 }}></Image>
              <Text numberOfLines={8} style={styles.descText}>
                Please move your camera {'\n'} over the QR Code
              </Text>
              <Image
                source={require('./../../assets/images/qr-code.png')}
                style={{ margin: 20 }}></Image>
              <TouchableOpacity
                onPress={this.activeQR}
                style={styles.buttonScan}>
                <View style={styles.buttonWrapper}>
                  <Image
                    source={require('./../../assets/images/camera.png')}
                    style={{ height: 36, width: 36 }}></Image>
                  <Text style={{ ...styles.buttonTextStyle, color: '#fff' }}>
                    Scan QR Code
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
          {ScanResult && (
            <Fragment>
              <Text style={styles.textTitle1}>Result</Text>
              <View style={verified ? styles.verifiedCardView : styles.unverifiedCardView}>
                <Text style={styles.textVerified}>Type : {verified ? 'Verified' : 'Bad code'} </Text>
                {Object.entries(result).map((entry, index) => (
                  <Text style={styles.textVerified} key={index}>{entry[0]} : {entry[1]}</Text>
                ))}
                <TouchableOpacity
                  onPress={this.scanAgain}
                  style={styles.buttonScan}>
                  <View style={styles.buttonWrapper}>
                    <Image
                      source={require('./../../assets/images/camera.png')}
                      style={{ height: 36, width: 36 }}></Image>
                    <Text style={{ ...styles.buttonTextStyle, color: '#2196f3' }}>
                      Click to scan again
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </Fragment>
          )}
          {scan && (
            <QRCodeScanner
              reactivate={true}
              showMarker={true}
              ref={node => {
                this.scanner = node;
              }}
              onRead={this.onSuccess}
              topContent={
                <Text style={styles.centerText}>
                  Please move your camera {'\n'} over the QR Code
                </Text>
              }
              bottomContent={
                <View>
                  <ImageBackground
                    source={require('./../../assets/images/bottom-panel.png')}
                    style={styles.bottomContent}>
                    <TouchableOpacity
                      style={styles.buttonScan2}
                      onPress={() => this.scanner.reactivate()}
                      onLongPress={() => this.setState({ scan: false })}>
                      <Image source={require('./../../assets/images/camera2.png')}></Image>
                    </TouchableOpacity>
                  </ImageBackground>
                </View>
              }
            />
          )}
        </Fragment>
      </View>
    );
  }
}
export default App;
