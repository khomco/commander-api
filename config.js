var cfg = {};


cfg.host = process.env.KAFKA_HOST || 'localhost';
cfg.port = process.env.KAFKA_PORT || '2181';


module.exports = cfg;