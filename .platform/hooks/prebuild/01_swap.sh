#!/bin/bash

# Check if swap file exists
if [ ! -f /var/swap.1 ]; then
    echo "Creating 3GB swap file..."
    /bin/dd if=/dev/zero of=/var/swap.1 bs=1M count=3072
    /sbin/mkswap /var/swap.1
    /sbin/swapon /var/swap.1
else
    echo "Swap file already exists."
fi
