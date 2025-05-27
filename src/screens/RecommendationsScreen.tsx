import React from 'react';
import { View, ScrollView, TouchableOpacity, Image, StyleSheet, Linking } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { AFFILIATE_PRODUCTS } from '../config/affiliates';

const RecommendationsScreen = () => {
    const openAffiliate = async (link: string) => {
        await Linking.openURL(link);
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Personalized Recommendations</Text>
            
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Best Credit Card Offers</Text>
                {AFFILIATE_PRODUCTS.CREDIT_CARDS.map((card, index) => (
                    <Card key={index} style={styles.card}>
                        <Card.Content>
                            <Text style={styles.productName}>{card.name}</Text>
                            <Text style={styles.description}>{card.description}</Text>
                            <TouchableOpacity 
                                style={styles.button}
                                onPress={() => openAffiliate(card.link)}
                            >
                                <Text style={styles.buttonText}>Apply Now</Text>
                            </TouchableOpacity>
                        </Card.Content>
                    </Card>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Investment Opportunities</Text>
                {AFFILIATE_PRODUCTS.INVESTMENTS.map((investment, index) => (
                    <Card key={index} style={styles.card}>
                        <Card.Content>
                            <Text style={styles.productName}>{investment.name}</Text>
                            <Text style={styles.description}>{investment.description}</Text>
                            <TouchableOpacity 
                                style={styles.button}
                                onPress={() => openAffiliate(investment.link)}
                            >
                                <Text style={styles.buttonText}>Start Investing</Text>
                            </TouchableOpacity>
                        </Card.Content>
                    </Card>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personal Loans</Text>
                {AFFILIATE_PRODUCTS.LOANS.map((loan, index) => (
                    <Card key={index} style={styles.card}>
                        <Card.Content>
                            <Text style={styles.productName}>{loan.name}</Text>
                            <Text style={styles.description}>{loan.description}</Text>
                            <TouchableOpacity 
                                style={styles.button}
                                onPress={() => openAffiliate(loan.link)}
                            >
                                <Text style={styles.buttonText}>Check Rate</Text>
                            </TouchableOpacity>
                        </Card.Content>
                    </Card>
                ))}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Banking Offers</Text>
                {AFFILIATE_PRODUCTS.BANKING.map((bank, index) => (
                    <Card key={index} style={styles.card}>
                        <Card.Content>
                            <Text style={styles.productName}>{bank.name}</Text>
                            <Text style={styles.description}>{bank.description}</Text>
                            <TouchableOpacity 
                                style={styles.button}
                                onPress={() => openAffiliate(bank.link)}
                            >
                                <Text style={styles.buttonText}>Open Account</Text>
                            </TouchableOpacity>
                        </Card.Content>
                    </Card>
                ))}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#2E7D32',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#1B5E20',
    },
    card: {
        marginBottom: 12,
        elevation: 2,
    },
    productName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    button: {
        backgroundColor: '#2E7D32',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
});

export default RecommendationsScreen; 