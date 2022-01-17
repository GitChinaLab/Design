FROM momar/web

ENV ENABLE_COMPRESSION=1
ENV ENABLE_INDEX=1

COPY design-kit /var/www/design-kit
COPY logo-kit /var/www/logo-kit
COPY index.html /var/www/
