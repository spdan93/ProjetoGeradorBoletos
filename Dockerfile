FROM php:7.3-apache
RUN apt-get update -y && apt-get install -y libmariadb-dev
RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli

COPY 90-xdebug.ini "${PHP_INI_DIR}/conf.d"
RUN pecl install -o -f xdebug
RUN docker-php-ext-enable xdebug

COPY php.ini "$PHP_INI_DIR/php.ini"