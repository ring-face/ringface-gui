import * as winston from 'winston'
import { SPLAT } from 'triple-beam'


const format1 = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss,ms' }),
  winston.format.splat(),
  winston.format.printf(
    (info) => {
      const args = info[SPLAT];
      if (args){
        const strArgs = args.map(JSON.stringify).join(' ');
        return `${info.timestamp} ${info.level}: ${info.message} ${strArgs}`;

      }

      return `${info.timestamp} ${info.level}: ${info.message}`;
    },
  ),
)


const logger = winston.createLogger({
  level: 'debug',
  format: format1,
  transports: [
    new winston.transports.Console({})
  ]
});

export default logger
