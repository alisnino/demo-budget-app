import logging

logging.basicConfig(level=logging.INFO, format='[%(asctime)s] %(levelname)s: %(message)s') # INFO, WARNING, ERROR AND CRITICAL will be printed
logger = logging.getLogger(__name__)
