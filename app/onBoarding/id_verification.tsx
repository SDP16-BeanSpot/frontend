// app/auth/id_verification.tsx
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

// 통신사 옵션 리스트
const CARRIERS = [
  'SKT',
  'KT', 
  'LG U+',
  'SKT 알뜰폰',
  'KT 알뜰폰',
  'LG U+ 알뜰폰'
];

export default function IdVerificationPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedCarrier, setSelectedCarrier] = useState('');
  const [name, setName] = useState('');
  const [socialNumber, setSocialNumber] = useState('');
  const [isCarrierModalVisible, setIsCarrierModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 휴대폰 번호 자동 포맷팅 (010-0000-0000)
  const formatPhoneNumber = (text: string) => {
    const numbers = text.replace(/[^0-9]/g, '');
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  // 주민등록번호 자동 포맷팅 (000000-0000000)
  const formatSocialNumber = (text: string) => {
    const numbers = text.replace(/[^0-9]/g, '');
    if (numbers.length <= 6) {
      return numbers;
    } else {
      return `${numbers.slice(0, 6)}-${numbers.slice(6, 13)}`;
    }
  };

  // 휴대폰 번호 입력 처리
  const handlePhoneNumberChange = (text: string) => {
    const formatted = formatPhoneNumber(text);
    if (formatted.length <= 13) { // 010-0000-0000 최대 길이
      setPhoneNumber(formatted);
    }
  };

  // 주민등록번호 입력 처리
  const handleSocialNumberChange = (text: string) => {
    const formatted = formatSocialNumber(text);
    if (formatted.length <= 14) { // 000000-0000000 최대 길이
      setSocialNumber(formatted);
    }
  };

  // 통신사 선택 처리
  const handleCarrierSelect = (carrier: string) => {
    setSelectedCarrier(carrier);
    setIsCarrierModalVisible(false);
  };

  // 각 단계별 입력 완료 여부 확인
  const isPhoneNumberComplete = phoneNumber.length === 13; // 010-0000-0000
  const isCarrierSelected = selectedCarrier !== '';
  const isNameComplete = name.trim().length > 0;
  const isSocialNumberComplete = socialNumber.length === 14; // 000000-0000000

  // 현재 단계에 따른 안내 문구 결정
  const getCurrentTitle = () => {
    if (!isPhoneNumberComplete) {
      return "안전한 중개를 위해 간단한 본인인증이 필요해요";
    } else if (!isCarrierSelected) {
      return "통신사를 선택해 주세요";
    } else if (!isNameComplete) {
      return "이름을 입력해주세요";
    } else if (!isSocialNumberComplete) {
      return "생년월일 및 성별을 입력해주세요";
    } else {
      return "입력 정보를 확인해주세요";
    }
  };

  // 모든 필드 완료 여부
  const isAllFieldsComplete = useMemo(() => {
    return isPhoneNumberComplete && isCarrierSelected && isNameComplete && isSocialNumberComplete;
  }, [isPhoneNumberComplete, isCarrierSelected, isNameComplete, isSocialNumberComplete]);

  // 본인인증 처리
  const handleVerification = async () => {
    if (!isAllFieldsComplete) {
      Alert.alert('알림', '모든 정보를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    
    try {
      console.log('본인인증 시도:', {
        phoneNumber,
        carrier: selectedCarrier,
        name,
        socialNumber
      });
      
      // 실제 본인인증 API 호출 (시뮬레이션)
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert('성공', '본인인증이 완료되었습니다!', [
          { text: '확인', onPress: () => router.replace('/') }
        ]);
      }, 2000);
      
    } catch (err) {
      setIsLoading(false);
      console.error(err);
      Alert.alert('오류', '본인인증에 실패했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>
        </View>

        {/* 동적 안내 문구 */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>{getCurrentTitle()}</Text>
        </View>

        {/* 입력 폼 */}
        <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
          
          {/* 현재 입력해야 할 필드만 상단에 표시 */}
          {!isPhoneNumberComplete && (
            <View style={[styles.inputContainer, styles.currentField]}>
              <Text style={styles.label}>휴대폰 번호</Text>
              <TextInput
                style={styles.input}
                placeholder="010-0000-0000"
                value={phoneNumber}
                onChangeText={handlePhoneNumberChange}
                keyboardType="phone-pad"
                autoCorrect={false}
                autoFocus={true}
              />
            </View>
          )}

          {isPhoneNumberComplete && !isCarrierSelected && (
            <View style={[styles.inputContainer, styles.currentField]}>
              <Text style={styles.label}>통신사</Text>
              <TouchableOpacity 
                style={styles.dropdown}
                onPress={() => setIsCarrierModalVisible(true)}
              >
                <Text style={[
                  styles.dropdownText, 
                  !selectedCarrier && styles.placeholder
                ]}>
                  {selectedCarrier || '통신사를 선택하세요'}
                </Text>
                <Text style={styles.dropdownArrow}>▼</Text>
              </TouchableOpacity>
            </View>
          )}

          {isCarrierSelected && !isNameComplete && (
            <View style={[styles.inputContainer, styles.currentField]}>
              <Text style={styles.label}>이름</Text>
              <TextInput
                style={styles.input}
                placeholder="이름을 입력하세요"
                value={name}
                onChangeText={setName}
                autoCorrect={false}
                autoFocus={true}
              />
            </View>
          )}

          {isNameComplete && !isSocialNumberComplete && (
            <View style={[styles.inputContainer, styles.currentField]}>
              <Text style={styles.label}>주민등록번호</Text>
              <TextInput
                style={styles.input}
                placeholder="000000-0000000"
                value={socialNumber}
                onChangeText={handleSocialNumberChange}
                keyboardType="number-pad"
                secureTextEntry
                autoCorrect={false}
                autoFocus={true}
              />
            </View>
          )}

          {/* 완료된 필드들은 아래쪽에 작게 표시 */}
          <View style={styles.completedFieldsContainer}>
            {isPhoneNumberComplete && (
              <View style={[styles.inputContainer, styles.completedField]}>
                <Text style={styles.completedLabel}>휴대폰 번호</Text>
                <View style={styles.completedValue}>
                  <Text style={styles.completedText}>{phoneNumber}</Text>
                </View>
              </View>
            )}

            {isCarrierSelected && (
              <View style={[styles.inputContainer, styles.completedField]}>
                <Text style={styles.completedLabel}>통신사</Text>
                <View style={styles.completedValue}>
                  <Text style={styles.completedText}>{selectedCarrier}</Text>
                </View>
              </View>
            )}

            {isNameComplete && (
              <View style={[styles.inputContainer, styles.completedField]}>
                <Text style={styles.completedLabel}>이름</Text>
                <View style={styles.completedValue}>
                  <Text style={styles.completedText}>{name}</Text>
                </View>
              </View>
            )}

            {isSocialNumberComplete && (
              <View style={[styles.inputContainer, styles.completedField]}>
                <Text style={styles.completedLabel}>주민등록번호</Text>
                <View style={styles.completedValue}>
                  <Text style={styles.completedText}>{socialNumber}</Text>
                </View>
              </View>
            )}
          </View>

        </ScrollView>
      </View>

      {/* 하단 고정 버튼 */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[
            styles.nextButton, 
            isAllFieldsComplete ? styles.nextButtonActive : styles.nextButtonInactive
          ]}
          onPress={handleVerification}
          disabled={!isAllFieldsComplete || isLoading}
        >
          <Text style={[
            styles.nextButtonText,
            isAllFieldsComplete ? styles.nextButtonTextActive : styles.nextButtonTextInactive
          ]}>
            {isLoading ? '인증 중...' : '다음'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 통신사 선택 모달 */}
      <Modal
        visible={isCarrierModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsCarrierModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>통신사 선택</Text>
              <TouchableOpacity 
                onPress={() => setIsCarrierModalVisible(false)}
              >
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.carrierList}>
              {CARRIERS.map((carrier, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.carrierItem}
                  onPress={() => handleCarrierSelect(carrier)}
                >
                  <Text style={styles.carrierText}>{carrier}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  
  // 헤더
  header: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  backButtonText: {
    fontSize: 24,
    color: '#333333',
  },

  // 타이틀 (동적으로 변경)
  titleSection: {
    marginBottom: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
    lineHeight: 26,
  },

  // 폼
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    color: '#333333',
  },

  // 현재 입력 필드 (상단에 크게 표시)
  currentField: {
    marginBottom: 32,
  },

  // 완료된 필드들 (하단에 작게 표시)
  completedFieldsContainer: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  completedField: {
    marginBottom: 16,
    opacity: 0.7,
  },
  completedLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666666',
    marginBottom: 6,
  },
  completedValue: {
    backgroundColor: '#F8F8F8',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  completedText: {
    fontSize: 14,
    color: '#666666',
  },
  
  // 드롭다운
  dropdown: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333333',
  },
  placeholder: {
    color: '#999999',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#666666',
  },

  // 하단 버튼
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 34,
    paddingTop: 16,
  },
  nextButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonActive: {
    backgroundColor: '#00D664',
  },
  nextButtonInactive: {
    backgroundColor: '#E0E0E0',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  nextButtonTextActive: {
    color: '#FFFFFF',
  },
  nextButtonTextInactive: {
    color: '#999999',
  },

  // 모달
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
  },
  modalCloseButton: {
    fontSize: 20,
    color: '#666666',
  },
  carrierList: {
    paddingHorizontal: 24,
  },
  carrierItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  carrierText: {
    fontSize: 16,
    color: '#333333',
  },
});
