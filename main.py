#!/usr/bin/python3
from lib.ConnectionUtilities import create_connection_from_config
from lib.ImageUtilities import import_image

conn = create_connection_from_config()
import_image(conn)