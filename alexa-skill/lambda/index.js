const Alexa = require('ask-sdk-core');

const HIGH_TIDE_THRESHOLD = 1.2;

// Helper function to load tide data for a specific month
function loadTideData(year, month) {
  const monthNames = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  try {
    return require(`./data/${year}/${monthNames[month - 1]}_${year}.json`);
  } catch (error) {
    console.error(`Error loading data for ${month}/${year}:`, error);
    return null;
  }
}

// Helper function to get tides for a specific date
function getTidesForDate(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  const monthData = loadTideData(year, month);
  if (!monthData || !monthData.dias) return null;
  
  const dayData = monthData.dias.find(d => d.dia === day);
  if (!dayData) return null;
  
  // Normalize to English field names for consistency in handlers
  return {
    day: dayData.dia,
    weekDay: dayData.diaSemana,
    tides: dayData.mares.map(m => ({
      time: m.hora,
      height: m.altura
    }))
  };
}

// Helper function to parse Alexa date slot
function parseAlexaDate(dateSlotValue) {
  if (!dateSlotValue || dateSlotValue === 'PRESENT_REF') {
    return new Date();
  }
  const parsed = new Date(dateSlotValue);
  return isNaN(parsed.getTime()) ? new Date() : parsed;
}

// Helper function to format tide speech
function formatTideSpeech(dayData, date) {
  if (!dayData || !dayData.tides || dayData.tides.length === 0) {
    return 'Não encontrei dados de maré para essa data.';
  }
  
  const weekDay = dayData.weekDay;
  const day = dayData.day;
  
  let speech = `Em Maceió, ${weekDay}, dia ${day}, `;
  
  const tides = dayData.tides.map(tide => {
    const type = tide.height >= HIGH_TIDE_THRESHOLD ? 'maré alta' : 'maré baixa';
    return `${type} às ${tide.time} com ${tide.height.toFixed(2).replace('.', ',')} metros`;
  });
  
  if (tides.length === 1) {
    speech += `temos ${tides[0]}.`;
  } else {
    const lastTide = tides.pop();
    speech += `temos ${tides.join(', ')}, e ${lastTide}.`;
  }
  
  return speech;
}

// ==================== HANDLERS ====================

// LaunchRequest Handler - When user opens the skill
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = 'Bem-vindo à Tábua de Marés de Maceió. ' +
      'Você pode perguntar: qual a maré de hoje, ou, qual a maré de amanhã?';
    
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt('Como posso ajudar? Pergunte sobre as marés de hoje ou de uma data específica.')
      .withSimpleCard('Tábua de Marés - Maceió', speechText)
      .getResponse();
  }
};

// GetTodayTidesIntent Handler - Today's tides
const GetTodayTidesIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetTodayTidesIntent';
  },
  handle(handlerInput) {
    const today = new Date();
    const dayData = getTidesForDate(today);
    const speechText = formatTideSpeech(dayData, today);
    
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Marés de Hoje - Maceió', speechText)
      .getResponse();
  }
};

// GetTidesByDateIntent Handler - Tides for a specific date
const GetTidesByDateIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetTidesByDateIntent';
  },
  handle(handlerInput) {
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const date = parseAlexaDate(slots.date?.value);
    const dayData = getTidesForDate(date);
    
    const speechText = dayData 
      ? formatTideSpeech(dayData, date)
      : 'Desculpe, não tenho dados de maré para essa data. Tenho informações apenas para o ano de 2026.';
    
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Marés - Maceió', speechText)
      .getResponse();
  }
};

// GetHighTideIntent Handler - High tides
const GetHighTideIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetHighTideIntent';
  },
  handle(handlerInput) {
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const date = parseAlexaDate(slots.date?.value);
    const dayData = getTidesForDate(date);
    
    const highTides = dayData?.tides?.filter(t => t.height >= HIGH_TIDE_THRESHOLD) || [];
    
    const speechText = highTides.length === 0
      ? 'Não encontrei dados de maré alta para essa data.'
      : `Em Maceió, a maré alta será ${highTides.map(t => 
          `às ${t.time} com ${t.height.toFixed(2).replace('.', ',')} metros`
        ).join(' e ')}.`;
    
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Maré Alta - Maceió', speechText)
      .getResponse();
  }
};

// GetLowTideIntent Handler - Low tides
const GetLowTideIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'GetLowTideIntent';
  },
  handle(handlerInput) {
    const slots = handlerInput.requestEnvelope.request.intent.slots;
    const date = parseAlexaDate(slots.date?.value);
    const dayData = getTidesForDate(date);
    
    const lowTides = dayData?.tides?.filter(t => t.height < HIGH_TIDE_THRESHOLD) || [];
    
    const speechText = lowTides.length === 0
      ? 'Não encontrei dados de maré baixa para essa data.'
      : `Em Maceió, a maré baixa será ${lowTides.map(t => 
          `às ${t.time} com ${t.height.toFixed(2).replace('.', ',')} metros`
        ).join(' e ')}.`;
    
    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Maré Baixa - Maceió', speechText)
      .getResponse();
  }
};

// HelpIntent Handler
const HelpIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'Posso informar os horários e alturas das marés em Maceió. ' +
      'Você pode perguntar: qual a maré de hoje, qual a maré de amanhã, ' +
      'quando é a maré alta, ou quando é a maré baixa. Como posso ajudar?';
    
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard('Ajuda - Tábua de Marés', speechText)
      .getResponse();
  }
};

// CancelAndStopIntent Handler
const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && ['AMAZON.CancelIntent', 'AMAZON.StopIntent'].includes(
        Alexa.getIntentName(handlerInput.requestEnvelope)
      );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak('Até logo! Boas marés!')
      .withSimpleCard('Tábua de Marés', 'Até logo! Boas marés!')
      .withShouldEndSession(true)
      .getResponse();
  }
};

// FallbackIntent Handler
const FallbackIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
  },
  handle(handlerInput) {
    const speechText = 'Desculpe, não entendi. ' +
      'Você pode perguntar sobre as marés de hoje ou de uma data específica. ' +
      'Por exemplo: qual a maré de hoje?';
    
    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  }
};

// SessionEndedRequest Handler
const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    return handlerInput.responseBuilder.getResponse();
  }
};

// CanFulfillIntentRequest Handler - Permite que a Alexa saiba que esta skill pode responder a perguntas diretas
const CanFulfillIntentRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'CanFulfillIntentRequest';
  },
  handle(handlerInput) {
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    
    // Lista de intents que esta skill pode atender
    const supportedIntents = [
      'GetTodayTidesIntent',
      'GetTidesByDateIntent',
      'GetHighTideIntent',
      'GetLowTideIntent'
    ];
    
    if (supportedIntents.includes(intentName)) {
      return handlerInput.responseBuilder
        .withCanFulfillIntent({
          canFulfill: 'YES',
          slots: {}
        })
        .getResponse();
    }
    
    return handlerInput.responseBuilder
      .withCanFulfillIntent({
        canFulfill: 'NO',
        slots: {}
      })
      .getResponse();
  }
};

// Error Handler
const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.error(`Error handled: ${error.message}`);
    console.error(`Error stack: ${error.stack}`);
    
    return handlerInput.responseBuilder
      .speak('Desculpe, ocorreu um erro. Por favor, tente novamente.')
      .reprompt('Tente novamente.')
      .getResponse();
  }
};

// ==================== SKILL BUILDER ====================

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    CanFulfillIntentRequestHandler,
    LaunchRequestHandler,
    GetTodayTidesIntentHandler,
    GetTidesByDateIntentHandler,
    GetHighTideIntentHandler,
    GetLowTideIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
