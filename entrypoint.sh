#!/bin/sh

# Check if container has IPC_LOCK capability
if capsh --print | grep -q cap_ipc_lock; then
    # Launch dbus for gnome-keyring
    if test -z "$DBUS_SESSION_BUS_ADDRESS" ; then
        exec dbus-run-session -- $0 "$@"
    fi

    # Unlock gnome-keyring to store credentials
    echo "root" | gnome-keyring-daemon -r -d --unlock
fi

exec "$@"
