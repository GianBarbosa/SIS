import healthUnitRepository from "../repositories/healthUnitRepository";

const API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

const healthUnitRepo = healthUnitRepository();

async function getHealthUnits() {
    const healthUnits = await healthUnitRepo.getHealthUnits();

    return healthUnits.map(async healthUnit => {
        return {
            ...healthUnit,
            embedUrl: await getIframeEmbedUrl(healthUnit)
        };
    });
}

async function getHealthUnitsByType(type) {
    const healthUnits = await healthUnitRepo.getHealthUnitsByType(type);

    return healthUnits.map(async healthUnit => {
        return {
            ...healthUnit,
            embedUrl: await getIframeEmbedUrl(healthUnit)
        };
    });
}

async function getHealthUnitsByRiskDegree(riskDegree) {
    let healthUnits;
    switch ((riskDegree || '').toUpperCase()) {
        case 'EMERGENCY':
            healthUnits = await healthUnitRepo.getHealthUnitsByType('URGENT_CARE');
            break;
        default:
            healthUnits = await healthUnitRepo.getHealthUnitsByType('PRIMARY_CARE');
    }

    return healthUnits.map(async healthUnit => {
        return {
            ...healthUnit,
            embedUrl: await getIframeEmbedUrl(healthUnit)
        };
    });
}

async function getIframeEmbedUrl(healthUnit) {
    const encodedAddress = encodeURIComponent(`${healthUnit.addressStreet}, ${healthUnit.addressCity}, ${healthUnit.addressState} ${healthUnit.addressZip}`);

    if (API_KEY && API_KEY !== 'YOUR_GOOGLE_MAPS_API_KEY') {
        return `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${encodedAddress}`;
    }

    // Fallback URL that works without a Maps Embed API key.
    return `https://www.google.com/maps?q=${encodedAddress}&output=embed`;
}

export default { getHealthUnits, getHealthUnitsByRiskDegree, getHealthUnitsByType }
