<?php

/**
 * Created by Reliese Model.
 */

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

/**
 * Class Role
 * 
 * @property int $RoleID
 * @property string $Name
 * @property string|null $Description
 * @property Carbon|null $CreatedAt
 * 
 * @property Collection|User[] $users
 *
 * @package App\Models
 */
class Role extends Model
{
	protected $table = 'Role';
	protected $primaryKey = 'RoleID';
	public $timestamps = false;

	protected $casts = [
		'CreatedAt' => 'datetime'
	];

	protected $fillable = [
		'Name',
		'Description',
		'CreatedAt'
	];

	public function users()
	{
		return $this->hasMany(User::class, 'RoleID');
	}
}
