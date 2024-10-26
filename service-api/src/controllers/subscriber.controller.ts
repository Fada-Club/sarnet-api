import { Request, Response } from 'express';
import { generateAuthToken } from '../helpers/index.js';
import { getValuePair, setValuePair } from '../utils/redis.js';
import prismac from '../utils/prismadb.js';


export const getAllSubscribers = async (req: Request, res: Response)=> {
  try {
    const subscribers = await prismac.subscriber.findMany();
    return res.status(200).json(subscribers);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const getSubscriber = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const redis = await getValuePair(`subscribers/${id}`);

    if (redis) {
      return res.json(redis);
    }

    const subscriber = await prismac.subscriber.findUnique({
      where: { id },
    });

    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    await setValuePair(`subscribers/${id}`, subscriber);
    return res.json(subscriber);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateSubscriber = async (req: Request, res: Response)=> {
  try {
    const { id } = req.params;
    const { email, organization, domain } = req.body;

    if (!id) {
      return res.sendStatus(400);
    }

    const subscriber = await prismac.subscriber.findUnique({
      where: { id },
    });

    if (!subscriber) {
      return res.sendStatus(404);
    }

    const updatedSubscriber = await prismac.subscriber.update({
      where: { id },
      data: { email, organization, domain },
    });

    return res.status(200).json(updatedSubscriber);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};

export const getSubscriberByEmailAuth = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const subscriber = await prismac.subscriber.findUnique({
      where: { email },
    });

    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    const token = await generateAuthToken(subscriber.id);
    return res.json({ subscriber, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getSubscriberByEmail = async (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const subscriber = await prismac.subscriber.findUnique({
      where: { email },
    });

    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }

    return res.json(subscriber);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};