import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import DropdownField from '../../components/DropdownField';
import DatePicker from '../../components/datePicker';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useRouter, useLocalSearchParams } from 'expo-router';
import ScreenHeader from '../../components/screenHeader';

const Booking = () => {
    const [pickupValue, setPickupValue] = useState(null);
    const [destinationValue, setDestinationValue] = useState(null);
    const [durationValue, setDurationValue] = useState(null);
    const [places, setPlaces] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [availableDurations, setAvailableDurations] = useState([]);
    const router = useRouter();
    const { id: vehiclId, model: vehicleModel, type: vehicleType, seats: vehicleSeat } = useLocalSearchParams();

    const handlePickupChange = (value) => {
        setPickupValue(value);
    };

    const handleDestinationChange = (value) => {
        setDestinationValue(value);
        updateAvailableDurations(value);
    };

    const handleDurationChange = (value) => {
        setDurationValue(value);
    };

    const handleDateTimeChange = (dateTime) => {
        setSelectedDate(dateTime);
    };

    const handleConfirmation = () => {
        if (!pickupValue || !destinationValue || !durationValue) {
            Alert.alert("Missing Information", "Please select pickup, destination, and duration before proceeding.");
            return;
        }

        const date = selectedDate.toISOString().split('T')[0];
        const time = selectedDate.toLocaleTimeString();

        router.push({
            pathname: '/screens/confirmation', 
            params: {
                id: vehiclId, 
                model: vehicleModel,
                type: vehicleType,
                seat: vehicleSeat,
                pickup: pickupValue,
                destination: destinationValue,
                duration: durationValue,
                date: date,
                time: time
            }
        });
    };

    const updateAvailableDurations = (destination) => {
        let updatedDurations = [
            { label: 'One Day', value: 'One Day' },
            { label: 'Two Days', value: 'Two Days' },
            { label: 'Three Days', value: 'Three Days' },
            { label: 'Four Days', value: 'Four Days' },
            { label: 'Five Days', value: 'Five Days' },
            { label: 'Six Days', value: 'Six Days' },
            { label: 'One Week', value: 'One Week' },
        ];

        if (['Ampara', 'Jaffna', 'Batticaloa', 'Mannar', 'Kilinochchi', 'Mullaitivu', 'Monaragala', 'Trincomalee', 'Vavuniya', 'Nuwara Eliya'].includes(destination)) {
            updatedDurations = updatedDurations.filter(d => d.value !== 'One Day' && d.value !== 'Two Days');
        } else if (['Colombo', 'Galle', 'Gampaha', 'Kalutara'].includes(destination)) {
            updatedDurations = updatedDurations.filter(d => d.value === 'One Day');
        } else if (['Anuradhapura', 'Polonnaruwa', 'Kegalle', 'Puttalam', 'Rathnapura', 'Matale', 'Matara', 'Kandy'].includes(destination)) {
            updatedDurations = updatedDurations.filter(d => d.value !== 'Five Days' && d.value !== 'Six Days' && d.value !== 'One Week');
        } else if (['Badulla', 'Hambanthota'].includes(destination)) {
            updatedDurations = updatedDurations.filter(d => d.value !== 'Six Days' && d.value !== 'One Week');
        } else if (['Kurunegala'].includes(destination)) {
            updatedDurations = updatedDurations.filter(d => d.value !== 'Four Days' && d.value !== 'Five Days' && d.value !== 'Six Days' && d.value !== 'One Week');
        }

        setAvailableDurations(updatedDurations);
        if (!updatedDurations.find(d => d.value === durationValue)) {
            setDurationValue(null);
        }
    };

    useEffect(() => {
        const fetchPlaces = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "places"));
                const placesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setPlaces(placesData);
            } catch (error) {
                console.error("Error fetching places:", error);
            }
        };
        fetchPlaces();
    }, []);

    const renderPlaceOptions = places.map(place => ({
        label: place.name,
        value: place.id,
    }));

    const pickUpOptions = [
        { label: 'Colombo 1', value: 'Colombo 1' },
        { label: 'Colombo 2', value: 'Colombo 2' },
        { label: 'Colombo 3', value: 'Colombo 3' },
        { label: 'Colombo 4', value: 'Colombo 4' },
        { label: 'Colombo 5', value: 'Colombo 5' },
        { label: 'Colombo 6', value: 'Colombo 6' },
        { label: 'Colombo 7', value: 'Colombo 7' },
        { label: 'Colombo 8', value: 'Colombo 8' },
        { label: 'Colombo 9', value: 'Colombo 9' },
        { label: 'Colombo 10', value: 'Colombo 10' },
        { label: 'Colombo 11', value: 'Colombo 11' },
        { label: 'Colombo 12', value: 'Colombo 12' },
        { label: 'Colombo 13', value: 'Colombo 13' },
        { label: 'Colombo 14', value: 'Colombo 14' },
        { label: 'Colombo 15', value: 'Colombo 15' },
    ];

    return (
        <View style={styles.container}>
            <ScreenHeader title="Booking" path="/tabs/vehicle"/>
            <View style={styles.innercontainer}>
                <DropdownField
                    title="Pick up"
                    value={pickupValue}
                    placeholder="Choose Pickup Destination"
                    options={pickUpOptions}
                    handleChange={handlePickupChange}
                    otherStyles="mt-7"
                />
                <DropdownField
                    title="Destination"
                    value={destinationValue}
                    placeholder="Choose Travel Destination"
                    options={renderPlaceOptions}
                    handleChange={handleDestinationChange}
                    otherStyles="mt-7"
                />
                <DropdownField
                    title="Duration"
                    value={durationValue}
                    placeholder="Choose Number of Days"
                    options={availableDurations}
                    handleChange={handleDurationChange}
                    otherStyles="mt-7"
                />
                <DatePicker
                    onDateTimeChange={handleDateTimeChange}
                    otherStyles="mt-7"
                    title={"Departure Date and Time"}
                    defaultDate={selectedDate} // Pass the default date
                    placeholder={"Select"} // Add placeholder
                />
                <TouchableOpacity 
                    style={[
                        styles.proceedButton, 
                        !pickupValue || !destinationValue || !durationValue || !selectedDate ? styles.disabledButton : {}
                    ]} 
                    onPress={handleConfirmation}  
                    disabled={!pickupValue || !destinationValue || !durationValue || !selectedDate} 
                >
                    <Text style={styles.proceedButtonText}>Proceed</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E6E6FA',
        flex: 1,
        margin: 0,
    },
    innercontainer: {
        margin: 10,
    },
    proceedButton: {
        backgroundColor: '#662483',
        paddingVertical: 12,
        width: 360,
        paddingHorizontal: 24,
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 20,
        margin: 7,
    },
    proceedButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontFamily: 'Poppins-SemiBold',
        textAlign: 'center',
    },
    disabledButton: {
        backgroundColor: '#A9A9A9',
    },
});

export default Booking;
