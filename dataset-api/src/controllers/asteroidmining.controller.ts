import { Request, Response } from 'express';
import prismac from '../utils/prismadb';


export const getData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const data = await prismac.asteroidMining.findMany({
      skip,
      take: Number(limit),
      include: {
        coordinates: true,
      },
    });

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getDataByCoordinates = async (req: Request, res: Response): Promise<void> => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      res.status(400).json({ message: 'Latitude and longitude are required' });
      return;
    }

    const data = await prismac.coordinates.findMany({
      where: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
      include: {
        asteroid: true,
      },
    });

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, location, coordinates, mineralComposition, estimatedValue, potentialMiningStatus } = req.body;

    const newAsteroid = await prismac.asteroidMining.create({
      data: {
        name,
        location,
        mineralComposition,
        estimatedValue,
        potentialMiningStatus,
        coordinates: {
          create: coordinates,
        },
      },
    });

    res.status(201).json(newAsteroid);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, location, coordinates, mineralComposition, estimatedValue, potentialMiningStatus } = req.body;

    const updatedAsteroid = await prismac.asteroidMining.update({
      where: { id },
      data: {
        name,
        location,
        mineralComposition,
        estimatedValue,
        potentialMiningStatus,
        coordinates: {
          deleteMany: {},
          create: coordinates,
        },
      },
    });

    res.status(200).json(updatedAsteroid);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteData = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    await prismac.asteroidMining.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};