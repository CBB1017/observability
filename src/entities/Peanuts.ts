import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Peanuts {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ default: "Unknown" })
    name: string;

    @Column({ default: "description" })
    description: string;
}
