import _saConfig from './_sa.config'
import _dbConfig from './_db.config'
import _esConfig from './_es.config'
import _jwtConfig from './_jwt.config'
import _redisConfig from './_redis.config'
import _emailConfig from './_email.config'
import _minioConfig from './_minio.config'
import _zstackConfig from './_zstack.config'

export default [
  _esConfig,
  _saConfig,
  _dbConfig,
  _jwtConfig,
  _redisConfig,
  _emailConfig,
  _minioConfig,
  _zstackConfig,
]
