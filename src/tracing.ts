import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

// configure the SDK to export telemetry data to the console
// enable all auto-instrumentations from the meta package
const exporterOptions = {
  url: 'http://tempo.monitoring:4318/v1/traces',
};
const traceExporter = new OTLPTraceExporter(exporterOptions);
const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]:
      process.env.SERVICE_NAME || 'schedule-provider',
    [SemanticResourceAttributes.SERVICE_NAMESPACE]: process.env.SERVICE_NAME,
  }),
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
});

// initialize the SDK and register with the OpenTelemetry API
// this enables the API to record telemetry
sdk.start();

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});
