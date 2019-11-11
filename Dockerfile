FROM debian:latest
MAINTAINER nshcore <nshcore@protonmail.com>

# Install packages specific to our project
RUN apt update -y && \
    apt install -y git curl build-essential wget autoconf libtool htop cmake libprotobuf-dev

# Build go dependancy
RUN curl -O https://dl.google.com/go/go1.10.2.linux-amd64.tar.gz && \
    tar xvf go1.10.2.linux-amd64.tar.gz && \
    mv go /usr/local

# Build Libra
#RUN git clone https://github.com/libra/libra.git && \
#    cd libra && \
#    yes | ./scripts/dev_setup.sh