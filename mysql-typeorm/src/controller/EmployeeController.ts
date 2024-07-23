// import { Request, Response } from 'express';
// import { Get, Post, Put, Delete, Param, Body, JsonController, Req, Res } from 'routing-controllers';
// import { AppDataSource } from '../data-source';
// import { Employee } from '../entity/Employee';

// @JsonController('/users')
// export class EmployeeController {
//     private employeeRepository = AppDataSource.getRepository(Employee);

//     @Get()
//     async getAll(@Req() request: Request, @Res() response: Response) {
//         const { id, name, email, website } = request.query;
//         const queryBuilder = this.employeeRepository.createQueryBuilder('employee');
        
//         if (id) {
//             queryBuilder.andWhere('employee.id = :id', { id });
//         }
//         if (name) {
//             queryBuilder.andWhere('employee.name LIKE :name', { name: `%${name}%` });
//         }
//         if (email) {
//             queryBuilder.andWhere('employee.email LIKE :email', { email: `%${email}%` });
//         }
//         if (website) {
//             queryBuilder.andWhere('employee.website LIKE :website', { website: `%${website}%` });
//         }
        
//         const employees = await queryBuilder.getMany();
//         return response.json(employees);
//     }

//     @Post()
//     async create(@Body() employee: Partial<Employee>, @Res() response: Response) {
//         if (!employee.name || !employee.email || !employee.website) {
//             return response.status(400).send({ error: 'Name, email, and website are required fields.' });
//         }
//         const newEmployee = this.employeeRepository.create(employee);
//         const savedEmployee = await this.employeeRepository.save(newEmployee);
//         return response.status(201).json(savedEmployee);
//     }

//     @Put('/:id')
//     async update(@Param('id') id: number, @Body() employee: Partial<Employee>, @Res() response: Response) {
//         await this.employeeRepository.update(id, employee);
//         const updatedEmployee = await this.employeeRepository.findOneBy({ id });
//         return response.json(updatedEmployee);
//     }

//     @Delete('/:id')
//     async delete(@Param('id') id: number, @Res() response: Response) {
//         await this.employeeRepository.delete(id);
//         return response.json({ id });
//     }
// }

import { Request, Response } from 'express';
import { Get, Post, Put, Delete, Param, Body, JsonController, Req, Res } from 'routing-controllers';
import { AppDataSource } from '../data-source';
import { Employee } from '../entity/Employee';

@JsonController('/users')
export class EmployeeController {
    private employeeRepository = AppDataSource.getRepository(Employee);

    @Get()
    async getAll(@Req() request: Request, @Res() response: Response) {
        const { id, name, email, website } = request.query;

        let whereConditions: any = {};
        if (id) whereConditions.id = id;
        if (name) whereConditions.name = `%${name}%`;
        if (email) whereConditions.email = `%${email}%`;
        if (website) whereConditions.website = `%${website}%`;

        try {
            const employees = await this.employeeRepository.find({
                where: whereConditions
            });
            return response.json(employees);
        } catch (error) {
            return response.status(500).send(error);
        }
    }

    @Post()
    async create(@Body() employee: Partial<Employee>, @Res() response: Response) {
        if (!employee.name || !employee.email || !employee.website) {
            return response.status(400).send({ error: 'Name, email, and website are required fields.' });
        }
        try {
            const newEmployee = this.employeeRepository.create(employee);
            const savedEmployee = await this.employeeRepository.save(newEmployee);
            return response.status(201).json(savedEmployee);
        } catch (error) {
            return response.status(500).send(error);
        }
    }

    @Put('/:id')
    async update(@Param('id') id: number, @Body() employee: Partial<Employee>, @Res() response: Response) {
        try {
            await this.employeeRepository.update(id, employee);
            const updatedEmployee = await this.employeeRepository.findOne({ where: { id } });
            if (!updatedEmployee) {
                return response.status(404).send({ error: 'Employee not found' });
            }
            return response.json(updatedEmployee);
        } catch (error) {
            return response.status(500).send(error);
        }
    }

    @Delete('/:id')
    async delete(@Param('id') id: number, @Res() response: Response) {
        try {
            const result = await this.employeeRepository.delete(id);
            if (result.affected === 0) {
                return response.status(404).send({ error: 'Employee not found' });
            }
            return response.json({ id });
        } catch (error) {
            return response.status(500).send(error);
        }
    }
}
