CYAN='\033[36m'
NORMAL='\033[0m'

# Generate the server private key'
openssl genrsa \
  -out animeplayer.key

# Generate the server certificate signing request
openssl req \
  -new \
  -key animeplayer.key \
  -out animeplayer.csr \
  -subj '/C=JP/ST=Kanto/L=Tokyo/O=Nours Inc./OU=Team Nours/CN=animeplayer.nours'

echo -e "$CYAN\n=== Generating a certificate for a Certificate Authority ===$NORMAL\n"
# This CA will sign the server's certificate, and we will install it in the browser
# This way, the browser will trust the server's certificate and not warn about security
openssl req \
  -x509 \
  -sha256 \
  -days 9999 \
  -newkey rsa:2048 \
  -keyout noursDevCA.key \
  -out noursDevCA.crt \
  -subj '/C=JP/ST=Kanto/L=Tokyo/O=Nours Inc./OU=Team Nours/CN=Nours Dev Authority'

# Create the SubjectAltName configuration file
{
  echo 'authorityKeyIdentifier=keyid,issuer'
  echo 'basicConstraints=CA:FALSE'
  echo 'subjectAltName = @alt_names'
  echo '[alt_names]'
  echo 'DNS.1 = animeplayer.nours'
  echo 'DNS.2 = localhost'
} > animeplayer.san

echo -e "$CYAN\n=== Generating and signing the server certificate ===$NORMAL\n"
openssl x509 \
  -req \
  -CA noursDevCA.crt \
  -CAkey noursDevCA.key \
  -in animeplayer.csr \
  -out animeplayer.crt \
  -days 9999 \
  -CAcreateserial \
  -extfile animeplayer.san



# useful link
# https://www.baeldung.com/openssl-self-signed-cert

# Probably worth looking at if I use this CA again
# https://stackoverflow.com/q/66357451