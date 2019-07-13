'use strict';
/**
 * Lists all nodes.
 */

const NodeService = (Node = require('../model/Node')) => {
  /**
   * Fetches all nodes.
   * @param {boolean} [active=false] returns only active nodes if true
   * @param {boolean} [passive=false] returns only passive nodes if true
   * @async
   */
  const fetchNodes = async (active = false, passive = false) => {
    return Node.collection().query((query) => {
      if (active && !passive) {
        query.where({node_status: 'ACTIVE'}).select();
      } else if (!active && passive) {
        query.where({node_status: 'PASSIVE'}).select();
      } else {
        query.select();
      }
    }).fetch({
      withRelated: ['timePoint', 'nextTimePoint'],
    });
  };

  /**
   * Prints node info for all nodes.
   * @param {boolean} [active=false] prints only active nodes if true
   * @param {boolean} [passive=false] prints only passive nodes if true
   * @param {Object} [logger=console] logger object
   * @async
   */
  const listNodes = async ({active = false, passive = false, logger = console}) => {
    return fetchNodes(active, passive).then((nodes) => nodes.forEach((node) => {
      logger.log('Id: ' + node.get('id'));
      logger.log('Dev id: ' + node.get('dev_id'));
      logger.log('Node status: ' + node.get('node_status'));
      logger.log('Last time active: ' + getTimePointISOString(node.related('timePoint')));
      logger.log('Next time active: ' + getTimePointISOString(node.related('nexTimePoint')));
      logger.log('Created at: ' + node.get('created_at'));
      logger.log('Updated at: ' + node.get('updated_at'));
    }));
  };

  const getTimePointISOString = (timePoint) => {
    if (timePoint && timePoint.get('time')) {
      return timePoint.get('time').toISOString();
    }
    return 'Time unavailable.';
  };

  /**
   * Checks if node with specified dev ID exists and returns it.
   * @param {String} devId
   * @param {Object} [logger=console] object required for logging
   * @throws Error if node cannot be fetched for some other reason than it not existing
   * @async
   */
  const checkIfNodeExists = async (devId, logger = console) => {
    let node;

    try {
      node = await new Node({dev_id: devId}).fetch({
        require: true,
        withRelated: ['nextTimePoint'],
      });
    } catch (err) {
      if (err instanceof Node.NotFoundError) {
        logger.log('Node does not exist. Returning a new node.');
        node = await new Node({dev_id: devId}).save();
      } else {
        logger.error('Error fetching node with dev id: ' + devId);
        throw new Error(checkIfNodeExists.caller.name + ': general error.');
      }
    }

    return node;
  };

  return {
    fetchNodes,
    listNodes,
    checkIfNodeExists,
  };
};

module.exports = NodeService;
