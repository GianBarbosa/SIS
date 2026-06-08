import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, Text, View } from 'react-native';
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

    const { riskDegree } = useLocalSearchParams();
    const selectedRiskDegree = Array.isArray(riskDegree) ? riskDegree[0] : riskDegree;

    const [healthUnits, setHealthUnits] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let isCancelled = false;

        async function loadHealthUnits() {
            setIsLoading(true);
            try {
                const units = selectedRiskDegree
                    ? await healthUnitService.getHealthUnitsByRiskDegree(selectedRiskDegree)
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
    }, [selectedRiskDegree]);

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


    return (<>
        {isLoading && (
            <View style={styles.feedbackContainer}>
                <ActivityIndicator size="small" color="#082841" />
            </View>
        )}
        {!isLoading && healthUnits.length === 0 && (
            <View style={styles.feedbackContainer}>
                <Text style={styles.feedbackText}>
                    {selectedRiskDegree
                        ? 'Nenhuma unidade encontrada para este grau de risco.'
                        : 'Nenhuma unidade de saude cadastrada.'}
                </Text>
            </View>
        )}
        {
            healthUnits.map(unit => (
                <View style={styles.mapContainer} key={unit.id}>
                    {renderMap(unit)}
                </View>
            ))
        }
    </>
    );
}

const styles = StyleSheet.create({
    mapContainer: {
        width: '100%',
        height: 400,
        marginBottom: 20,
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

