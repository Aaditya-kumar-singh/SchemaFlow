#!/bin/bash
# ----------------------------------------------------------------------
# 01_swap.sh
# Create a 3GB swap file if it doesn't exist.
# This prevents OOM (Out Of Memory) errors during Next.js builds on t3.small
# ----------------------------------------------------------------------

SWAP_FILE="/var/swap.1"
SWAP_SIZE_MB=3072

if [ ! -f "$SWAP_FILE" ]; then
    echo "Creating $SWAP_SIZE_MB MB swap file at $SWAP_FILE..."
    /bin/dd if=/dev/zero of=$SWAP_FILE bs=1M count=$SWAP_SIZE_MB
    /sbin/mkswap $SWAP_FILE
    /sbin/swapon $SWAP_FILE
    echo "Swap created and enabled."
else
    echo "Swap file $SWAP_FILE already exists. Skipping."
fi
