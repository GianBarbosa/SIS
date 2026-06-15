import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import healthUnitService from '../src/services/healthUnitService';

const NativeWebView = Platform.OS === 'web' ? null : require('react-native-webview').WebView;

function buildNativeMapHtml(embedUrl) {
        return `<!doctype html>
<html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        <style>
            html, body {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                overflow: hidden;
                background: #ffffff;
            }
            iframe {
                width: 100%;
                height: 100%;
                border: 0;
            }
        </style>
    </head>
    <body>
        <iframe
            src="${embedUrl}"
            allowfullscreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
    </body>
</html>`;
}

export default function HealthUnitsRoute() {

    const router = useRouter();

    const { riskDegree } = useLocalSearchParams();
    const selectedRiskDegree = Array.isArray(riskDegree) ? riskDegree[0] : riskDegree;

    const riskDegreeToTypeMap = {
        EMERGENCY: 'URGENT_CARE',
        MODERATE: 'PRIMARY_CARE',
        LOW: 'PRIMARY_CARE',
    };

    const [selectedType, setSelectedType] = useState(
        selectedRiskDegree ? (riskDegreeToTypeMap[selectedRiskDegree] || 'PRIMARY_CARE') : ''
    );

    const typeOptions = [
        { label: 'Todas', value: '' },
        { label: 'Emergência', value: 'URGENT_CARE' },
        { label: 'Atenção básica', value: 'PRIMARY_CARE' },
    ];

    const typeTitleMap = {
        URGENT_CARE: 'Unidades de emergência próximas',
        PRIMARY_CARE: 'Unidades básicas próximas',
        ACUTE_CARE: 'Unidades de cuidados agudos próximas',
        SPECIALTY_CARE: 'Unidades especializadas próximas',
    };

    const screenTitle =
        selectedType
            ? (typeTitleMap[selectedType] || 'Unidades de saúde próximas')
            : 'Unidades de saúde próximas';


    const [healthUnits, setHealthUnits] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let isCancelled = false;

        async function loadHealthUnits() {
            setIsLoading(true);
            try {
                const units = selectedType
                    ? await healthUnitService.getHealthUnitsByType(selectedType)
                    : await healthUnitService.getHealthUnits();
                const resolvedUnits = await Promise.all(units ?? []);
                if (!isCancelled) {
                    setHealthUnits(resolvedUnits.filter(Boolean));
                }
            } finally {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            }
        }

        loadHealthUnits();

        return () => {
            isCancelled = true;
        };
    }, [selectedType]);

    function renderMap(unit) {
        if (Platform.OS === 'web') {
            return (
                <iframe
                    src={unit.embedUrl}
                    style={styles.webMapFrame}
                    loading="lazy"
                    allowFullScreen
                    title={`health-unit-map-${unit.id}`}
                />
            );
        }

        if (!NativeWebView) {
            return null;
        }

        return (
            <NativeWebView
                source={{ html: buildNativeMapHtml(unit.embedUrl) }}
                style={styles.map}
                originWhitelist={['*']}
                allowsInlineMediaPlayback={true}
                domStorageEnabled={true}
                javaScriptEnabled={true}
            />
        );
    }


    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >

            <TouchableOpacity onPress={() => router.back()}>
            <LinearGradient
                colors={['#d3d3d3', '#BABABA']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.cancelButton}
            >

                <View style={styles.cancelTouchable}>

                     <View style={styles.closeCircle}>
                        <Text style={styles.closeText}>
                            ←
                        </Text>
                     </View>

                        <Text style={styles.cancelText}>
                            Voltar
                        </Text>

                </View>

            </LinearGradient>
        </TouchableOpacity>

            <Text style={styles.screenTitle}>
                {screenTitle}
            </Text>

            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterRow}
            >
                {typeOptions.map(option => {
                    const isSelected = selectedType === option.value;

                    return (
                        <TouchableOpacity
                            key={option.value || 'ALL'}
                            onPress={() => setSelectedType(option.value)}
                            style={[
                                styles.filterChip,
                                isSelected ? styles.filterChipSelected : null,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.filterChipText,
                                    isSelected ? styles.filterChipTextSelected : null,
                                ]}
                            >
                                {option.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {isLoading && (
                <View style={styles.feedbackContainer}>
                    <ActivityIndicator size="small" color="#082841" />
                </View>
            )}

            {!isLoading && healthUnits.length === 0 && (
                <View style={styles.feedbackContainer}>
                    <Text style={styles.feedbackText}>
                        {selectedType
                            ? 'Nenhuma unidade encontrada para este tipo.'
                            : 'Nenhuma unidade de saúde cadastrada.'}
                    </Text>
                </View>
            )}

            {healthUnits.map(unit => (
                <LinearGradient
                    key={unit.id}
                    colors={['#ffff', '#efefef']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.unitCard}
                >

                    <View style={styles.smallMap}>
                        {renderMap(unit)}
                    </View>

                    <View style={styles.infoContainer}>

                        <Text style={styles.unitName}>
                            {unit.nome}
                        </Text>

                        <Text style={styles.unitAddress}>
                            {unit.addressCity} - {unit.addressState}
                        </Text>

                        <Text style={styles.unitAddress}>
                            {unit.addressStreet}
                        </Text>

                        <Text style={styles.unitPhone}>
                            {unit.phone}
                        </Text>

                        <Text style={styles.unitType}>
                            {unit.openingHours}
                        </Text>

                    </View>

                </LinearGradient>
            ))}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
 
cancelButton: {
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    marginBottom: 30,
},

cancelTouchable: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
},

cancelText: {
    color: '#082841',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Roboto',
},

closeCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
},

closeText: {
    fontSize: 18, 
    color: '#082841',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: -5,
    fontFamily: 'Roboto',
},


container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    backgroundColor: '#F3F3F3',
},

scrollContent: {
    paddingBottom: 24,
},

screenTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#082841',
    marginBottom: 16,
},

filterRow: {
    paddingBottom: 16,
    gap: 8,
},

filterChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D0D7DE',
    backgroundColor: '#FFFFFF',
},

filterChipSelected: {
    backgroundColor: '#082841',
    borderColor: '#082841',
},

filterChipText: {
    color: '#082841',
    fontSize: 13,
    fontWeight: '600',
},

filterChipTextSelected: {
    color: '#FFFFFF',
},

unitCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 6,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
},

smallMap: {
    width: 120,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
},

infoContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
},

unitName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#082841',
    
},

unitAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
},

unitType: {
    fontSize: 14,
    color: '#0860A6',
    marginTop: 8,
    fontWeight: '600',
},
    map: {
        flex: 1,
    },
    webMapFrame: {
        width: '100%',
        height: '100%',
        borderWidth: 0,
    },
    feedbackContainer: {
        width: '100%',
        paddingVertical: 16,
        alignItems: 'center',
    },
    feedbackText: {
        color: '#082841',
        fontSize: 16,
    },
});

