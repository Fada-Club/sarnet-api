import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getValuePair, setValuePair } from '../utils/redis';
import prismac from '../utils/prismadb.js';


export const getAllSubscribers = async (req: Request, res: Response): Promise<void> => {
  try {
    const subscribers = await prismac.subscriber.findMany();
    res.status(200).json(subscribers);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const getSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: 'No id provided' });
      return;
    }

    const redis = await getValuePair(`subscription/${id}`);

    if (redis) {
      res.json(redis);
      return;
    }

    const subscription = await prismac.subscription.findUnique({
      where: { id },
    });

    if (!subscription) {
      res.status(404).json({ message: 'Subscription not found' });
      return;
    }

    await setValuePair(`subscription/${id}`, subscription);
    res.json(subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSubscriptionsBySubscriberId = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ message: 'No subscriber_id provided' });
      return;
    }

    const redis = await getValuePair(`subscriptions/subscriber/${id}`);

    if (redis) {
      res.json(redis);
      return;
    }

    const subscriptions = await prismac.subscription.findMany({
      where: { subscriber_id: id },
    });

    if (!subscriptions) {
      res.status(404).json({ message: 'Subscriptions not found' });
      return;
    }

    await setValuePair(`subscriptions/subscriber/${id}`, subscriptions);
    res.json(subscriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createNewSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { subscriber_id, dataset_name, status } = req.body;

    if (!subscriber_id || !dataset_name || !status) {
      res.status(400).json({ message: 'Subscriber ID, dataset name, and status are required' });
      return;
    }

    const subscription = await prismac.subscription.create({
        //@ts-ignore
      data: { subscriber_id, dataset_name, status },
    });

    res.status(201).json(subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const deletedSubscription = await prismac.subscription.delete({
      where: { id },
    });

    res.json(deletedSubscription);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};

export const updateSubscription = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { subscriber_id, dataset_name, status } = req.body;

    if (!subscriber_id || !dataset_name || !status) {
      res.sendStatus(400);
      return;
    }

    const updatedSubscription = await prismac.subscription.update({
      where: { id },
      //@ts-ignore
      data: { subscriber_id, dataset_name, status },
    });

    res.status(200).json(updatedSubscription);
  } catch (error) {
    console.log(error);
    res.sendStatus(400);
  }
};